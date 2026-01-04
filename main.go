package main

import (
	"embed"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

//go:embed embed/*
var embeddedFiles embed.FS

const (
	agentsMarker = "## Issue Tracking (bd)"
	green        = "\033[0;32m"
	yellow       = "\033[1;33m"
	reset        = "\033[0m"
)

func info(msg string) {
	fmt.Printf("%s✓%s %s\n", green, reset, msg)
}

func warn(msg string) {
	fmt.Printf("%s!%s %s\n", yellow, reset, msg)
}

func fatal(msg string) {
	fmt.Fprintf(os.Stderr, "error: %s\n", msg)
	os.Exit(1)
}

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

func dirExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && info.IsDir()
}

func readEmbedded(name string) string {
	data, err := embeddedFiles.ReadFile("embed/" + name)
	if err != nil {
		fatal(fmt.Sprintf("failed to read embedded file %s: %v", name, err))
	}
	return string(data)
}

func runCommand(name string, args ...string) error {
	cmd := exec.Command(name, args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func initBeads() {
	if dirExists(".beads") {
		info("Beads already initialized")
	} else {
		if err := runCommand("bd", "init"); err != nil {
			fatal(fmt.Sprintf("failed to initialize beads: %v", err))
		}
		info("Initialized beads")
	}

	// Set no-git-ops config
	if err := runCommand("bd", "config", "set", "no-git-ops", "true"); err != nil {
		warn(fmt.Sprintf("failed to set no-git-ops config: %v", err))
	} else {
		info("Set no-git-ops config")
	}
}

func initDevdocs() {
	if err := os.MkdirAll("devdocs/archive", 0755); err != nil {
		fatal(fmt.Sprintf("failed to create devdocs directory: %v", err))
	}

	readmePath := "devdocs/README.md"
	if !fileExists(readmePath) {
		content := readEmbedded("devdocs-README.md")
		if err := os.WriteFile(readmePath, []byte(content), 0644); err != nil {
			fatal(fmt.Sprintf("failed to write %s: %v", readmePath, err))
		}
		info("Created devdocs/README.md")
	} else {
		info("devdocs/README.md already exists")
	}
}

func initAgentsMd() {
	agentsContent := readEmbedded("AGENTS.md")

	if fileExists("AGENTS.md") {
		existing, err := os.ReadFile("AGENTS.md")
		if err != nil {
			fatal(fmt.Sprintf("failed to read AGENTS.md: %v", err))
		}
		existingStr := string(existing)

		if strings.Contains(existingStr, agentsMarker) {
			info("AGENTS.md already contains devdocs methodology")
			return
		}

		// Check if this is just beads-generated content (landing-the-plane)
		// If so, replace it entirely since we use no-git-ops
		if strings.Contains(existingStr, "Landing the Plane") {
			if err := os.WriteFile("AGENTS.md", []byte(agentsContent), 0644); err != nil {
				fatal(fmt.Sprintf("failed to write AGENTS.md: %v", err))
			}
			info("Replaced beads AGENTS.md with devdocs methodology (no-git-ops mode)")
			return
		}

		// Append to existing file that has custom content
		f, err := os.OpenFile("AGENTS.md", os.O_APPEND|os.O_WRONLY, 0644)
		if err != nil {
			fatal(fmt.Sprintf("failed to open AGENTS.md: %v", err))
		}
		defer f.Close()

		if _, err := f.WriteString("\n" + agentsContent); err != nil {
			fatal(fmt.Sprintf("failed to append to AGENTS.md: %v", err))
		}
		info("Appended devdocs methodology to AGENTS.md")
	} else {
		if err := os.WriteFile("AGENTS.md", []byte(agentsContent), 0644); err != nil {
			fatal(fmt.Sprintf("failed to write AGENTS.md: %v", err))
		}
		info("Created AGENTS.md")
	}
}

func initPiHooks() {
	hookDir := filepath.Join(".pi", "hooks")
	if err := os.MkdirAll(hookDir, 0755); err != nil {
		fatal(fmt.Sprintf("failed to create .pi/hooks directory: %v", err))
	}

	// bd-prime hook
	bdPrimePath := filepath.Join(hookDir, "bd-prime.ts")
	if !fileExists(bdPrimePath) {
		content := readEmbedded("bd-prime.ts")
		if err := os.WriteFile(bdPrimePath, []byte(content), 0644); err != nil {
			fatal(fmt.Sprintf("failed to write %s: %v", bdPrimePath, err))
		}
		info("Created .pi/hooks/bd-prime.ts")
	} else {
		info(".pi/hooks/bd-prime.ts already exists")
	}

	// devdocs-commands hook
	commandsPath := filepath.Join(hookDir, "devdocs-commands.ts")
	if !fileExists(commandsPath) {
		content := readEmbedded("devdocs-commands.ts")
		if err := os.WriteFile(commandsPath, []byte(content), 0644); err != nil {
			fatal(fmt.Sprintf("failed to write %s: %v", commandsPath, err))
		}
		info("Created .pi/hooks/devdocs-commands.ts")
	} else {
		info(".pi/hooks/devdocs-commands.ts already exists")
	}
}

func cmdInit() {
	initBeads()
	initDevdocs()
	initAgentsMd()
	initPiHooks()

	fmt.Println()
	fmt.Println("Done! Your repository now has:")
	fmt.Println("  • Beads issue tracking (bd)")
	fmt.Println("  • devdocs/ for epics and reference docs")
	fmt.Println("  • AGENTS.md with methodology")
	fmt.Println("  • pi hooks for bd prime + slash commands")
	fmt.Println()
	fmt.Println("Slash commands: /epic-create, /epic-archive, /devdocs-status, etc.")
	fmt.Println("Run /help in pi to see all commands.")
}

func printUsage() {
	fmt.Println("devdocs - Initialize devdocs + beads methodology")
	fmt.Println()
	fmt.Println("Usage:")
	fmt.Println("  devdocs init    Initialize in current directory")
	fmt.Println("  devdocs help    Show this help")
	fmt.Println()
	fmt.Println("Install:")
	fmt.Println("  go install github.com/mrexodia/devdocs-cli@latest")
}

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(0)
	}

	switch os.Args[1] {
	case "init":
		cmdInit()
	case "help", "-h", "--help":
		printUsage()
	default:
		fmt.Fprintf(os.Stderr, "unknown command: %s\n", os.Args[1])
		printUsage()
		os.Exit(1)
	}
}
