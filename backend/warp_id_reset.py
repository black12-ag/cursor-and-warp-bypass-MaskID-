#!/usr/bin/env python3
"""
Warp Machine ID Reset Tool
===========================

This tool resets Warp's machine identity without removing the application.
After running this tool, Warp will think you're on a completely new machine
while keeping all your app installations intact.

Usage:
    python warp_id_reset.py
    
or make it executable:
    chmod +x warp_id_reset.py
    ./warp_id_reset.py
"""

import os
import sys
import platform
import subprocess
import shutil
import glob
import time
from pathlib import Path


class WarpIdentityReset:
    def __init__(self):
        self.system = platform.system()
        self.home = Path.home()
        self.reset_count = 0
        
    def print_emoji(self, emoji, message):
        """Print message with emoji (works cross-platform)"""
        print(f"{emoji} {message}")
        
    def safe_remove(self, path_pattern, description=""):
        """Safely remove files/directories matching pattern"""
        if isinstance(path_pattern, str):
            paths = glob.glob(path_pattern)
        else:
            paths = [str(path_pattern)] if path_pattern.exists() else []
            
        for path in paths:
            try:
                if os.path.isdir(path):
                    shutil.rmtree(path)
                    self.print_emoji("🗂️", f"Reset {description}: {os.path.basename(path)}")
                elif os.path.isfile(path):
                    os.remove(path)
                    self.print_emoji("📄", f"Reset {description}: {os.path.basename(path)}")
                self.reset_count += 1
            except (OSError, PermissionError) as e:
                self.print_emoji("⚠️", f"Couldn't reset {path}: {e}")
                
    def kill_warp_processes(self):
        """Kill all Warp processes to ensure clean reset"""
        self.print_emoji("🔄", "Stopping Warp processes for identity reset...")
        
        try:
            if self.system == "Darwin":  # macOS
                subprocess.run(["pkill", "-f", "-i", "warp"], 
                             stderr=subprocess.DEVNULL, check=False)
            elif self.system == "Windows":
                subprocess.run(["taskkill", "/F", "/IM", "warp.exe"], 
                             stderr=subprocess.DEVNULL, check=False)
                subprocess.run(["taskkill", "/F", "/IM", "Warp.exe"], 
                             stderr=subprocess.DEVNULL, check=False)
            
            time.sleep(2)  # Give processes time to terminate
            self.print_emoji("✅", "Warp processes stopped")
            
        except Exception as e:
            self.print_emoji("⚠️", f"Process stop warning: {e}")
            
    def reset_macos_identity(self):
        """Reset Warp identity on macOS - keeps app installed"""
        self.print_emoji("🍎", "Resetting Warp identity on macOS...")
        
        # Note: We DON'T remove /Applications/Warp.app - that stays!
        
        # User identity and session data
        self.print_emoji("🔑", "Clearing user identity data...")
        
        # Application Support - user data, settings, machine ID
        self.safe_remove(str(self.home / "Library/Application Support/*warp*"), "user data")
        self.safe_remove(str(self.home / "Library/Application Support/*Warp*"), "user data")
        
        # Preferences - user preferences and machine-specific settings
        self.print_emoji("⚙️", "Clearing preferences and settings...")
        self.safe_remove(str(self.home / "Library/Preferences/*warp*"), "preferences")
        self.safe_remove(str(self.home / "Library/Preferences/*Warp*"), "preferences")
        
        # Caches - temporary files that might contain machine info
        self.print_emoji("🧹", "Clearing cache files...")
        self.safe_remove(str(self.home / "Library/Caches/*warp*"), "cache")
        self.safe_remove(str(self.home / "Library/Caches/*Warp*"), "cache")
        
        # Logs - might contain machine identification
        self.print_emoji("📋", "Clearing log files...")
        self.safe_remove(str(self.home / "Library/Logs/*warp*"), "logs")
        self.safe_remove(str(self.home / "Library/Logs/*Warp*"), "logs")
        
        # WebKit data - browser data that might have machine fingerprints
        self.print_emoji("🌐", "Clearing web data...")
        self.safe_remove(str(self.home / "Library/WebKit/*warp*"), "web data")
        self.safe_remove(str(self.home / "Library/WebKit/*Warp*"), "web data")
        
        # Saved Application State - window states and session info
        self.print_emoji("💾", "Clearing application state...")
        self.safe_remove(str(self.home / "Library/Saved Application State/*warp*"), "app state")
        self.safe_remove(str(self.home / "Library/Saved Application State/*Warp*"), "app state")
        
        # HTTP Storage - might contain session tokens
        self.print_emoji("🔐", "Clearing HTTP storage...")
        self.safe_remove(str(self.home / "Library/HTTPStorages/*warp*"), "HTTP storage")
        self.safe_remove(str(self.home / "Library/HTTPStorages/*Warp*"), "HTTP storage")
        
        # Clear Launch Services database (helps reset file associations)
        self.print_emoji("📊", "Updating system database...")
        try:
            lsregister_path = ("/System/Library/Frameworks/CoreServices.framework/"
                             "Frameworks/LaunchServices.framework/Support/lsregister")
            subprocess.run([lsregister_path, "-kill", "-r", "-domain", "local", 
                          "-domain", "system", "-domain", "user"], 
                         stderr=subprocess.DEVNULL, check=False)
        except Exception as e:
            self.print_emoji("⚠️", f"Database update warning: {e}")
            
    def reset_windows_identity(self):
        """Reset Warp identity on Windows - keeps app installed"""
        self.print_emoji("🪟", "Resetting Warp identity on Windows...")
        
        # Note: We DON'T remove Program Files installation - that stays!
        
        local_appdata = Path(os.environ.get('LOCALAPPDATA', str(self.home / 'AppData/Local')))
        appdata = Path(os.environ.get('APPDATA', str(self.home / 'AppData/Roaming')))
        
        # User identity and session data
        self.print_emoji("🔑", "Clearing user identity data...")
        
        # AppData Local - user data, settings, machine ID
        self.safe_remove(str(local_appdata / "*warp*"), "user data")
        self.safe_remove(str(local_appdata / "*Warp*"), "user data")
        
        # AppData Roaming - roaming user settings
        self.print_emoji("⚙️", "Clearing roaming preferences...")
        self.safe_remove(str(appdata / "*warp*"), "preferences")
        self.safe_remove(str(appdata / "*Warp*"), "preferences")
        
        # Temp files - temporary files that might contain machine info
        self.print_emoji("🧹", "Clearing temporary files...")
        temp_dir = Path(os.environ.get('TEMP', 'C:/Windows/Temp'))
        self.safe_remove(str(temp_dir / "*warp*"), "temp files")
        self.safe_remove(str(temp_dir / "*Warp*"), "temp files")
        
        # Registry cleanup - remove machine-specific registry entries
        self.print_emoji("📊", "Resetting registry entries...")
        try:
            import winreg
            # Clean up user-specific registry locations (not system-wide)
            registry_paths = [
                (winreg.HKEY_CURRENT_USER, "Software\\Warp"),
                # Note: We don't touch HKEY_LOCAL_MACHINE to preserve installation
            ]
            
            for root, subkey in registry_paths:
                try:
                    winreg.DeleteKeyEx(root, subkey)
                    self.print_emoji("🔑", f"Reset registry: {subkey}")
                except WindowsError:
                    pass  # Key doesn't exist or no permission
                    
        except ImportError:
            self.print_emoji("⚠️", "Registry reset requires Windows")
        except Exception as e:
            self.print_emoji("⚠️", f"Registry reset warning: {e}")
            
    def verify_app_still_installed(self):
        """Verify that Warp app is still installed"""
        self.print_emoji("🔍", "Verifying Warp installation...")
        
        app_exists = False
        
        if self.system == "Darwin":  # macOS
            app_path = "/Applications/Warp.app"
            app_exists = os.path.exists(app_path)
            if app_exists:
                self.print_emoji("✅", f"Warp app still installed: {app_path}")
            else:
                self.print_emoji("❌", "Warp app not found - may not be installed")
                
        elif self.system == "Windows":
            # Check common Windows installation paths
            program_files = Path(os.environ.get('PROGRAMFILES', 'C:/Program Files'))
            program_files_x86 = Path(os.environ.get('PROGRAMFILES(X86)', 'C:/Program Files (x86)'))
            
            possible_paths = [
                program_files / "Warp",
                program_files_x86 / "Warp",
            ]
            
            for path in possible_paths:
                if path.exists():
                    app_exists = True
                    self.print_emoji("✅", f"Warp app still installed: {path}")
                    break
                    
            if not app_exists:
                self.print_emoji("❌", "Warp app not found - may not be installed")
                
        return app_exists
        
    def run(self):
        """Main identity reset process"""
        print("=" * 70)
        self.print_emoji("🔄", "Starting Warp Machine Identity Reset...")
        self.print_emoji("💻", f"Detected system: {self.system}")
        self.print_emoji("🎯", "App will remain installed - only identity data will be reset")
        print("=" * 70)
        
        # Step 1: Stop processes
        self.kill_warp_processes()
        
        # Step 2: Platform-specific identity reset
        if self.system == "Darwin":  # macOS
            self.reset_macos_identity()
        elif self.system == "Windows":
            self.reset_windows_identity()
        else:
            self.print_emoji("❌", f"Unsupported system: {self.system}")
            self.print_emoji("💡", "This tool supports macOS and Windows only")
            return False
            
        # Step 3: Verify app is still there
        app_still_there = self.verify_app_still_installed()
        
        # Final report
        print("\n" + "=" * 70)
        self.print_emoji("✅", "WARP IDENTITY RESET COMPLETE!")
        print(f"📈 Reset {self.reset_count} identity items")
        
        if app_still_there:
            self.print_emoji("🎉", "Perfect! Warp app is still installed")
            self.print_emoji("🆔", "Your machine now has a fresh identity to Warp")
            self.print_emoji("🚀", "Launch Warp - it will see you as a new user/machine")
        else:
            self.print_emoji("⚠️", "Warp app not detected - you may need to install it")
            
        self.print_emoji("🔄", "Next: Open Warp and enjoy your fresh machine identity!")
        print("=" * 70)
        
        return True


def main():
    """Entry point"""
    if len(sys.argv) > 1 and sys.argv[1] in ['-h', '--help', 'help']:
        print(__doc__)
        return
        
    # Warn about admin privileges
    if platform.system() == "Windows":
        print("💡 Note: For complete reset on Windows, run as Administrator")
        print("   Right-click Command Prompt/PowerShell -> 'Run as Administrator'")
        print()
        
    print("🔄 WARP MACHINE IDENTITY RESET")
    print("================================")
    print("This tool will:")
    print("✅ Keep Warp app installed")
    print("🔄 Reset your machine identity") 
    print("🗑️  Clear user data and preferences")
    print("🆔 Make Warp see you as a new user")
    print()
    
    # Confirm before proceeding
    response = input("⚠️  Reset Warp machine identity? Your app will stay installed (y/N): ")
    if response.lower() not in ['y', 'yes']:
        print("❌ Cancelled by user")
        return
        
    # Run the reset
    reset_tool = WarpIdentityReset()
    success = reset_tool.run()
    
    if success:
        print("\n🎯 Identity reset completed successfully!")
        print("🚀 Launch Warp to start fresh!")
    else:
        print("\n❌ Identity reset failed or incomplete")
        sys.exit(1)


if __name__ == "__main__":
    main()
