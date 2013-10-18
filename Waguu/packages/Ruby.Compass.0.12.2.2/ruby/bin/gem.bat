@ECHO OFF
IF NOT "%~f0" == "~f0" GOTO :WinNT
@"ruby.exe" "D:/downloads/ruby-2.0.0-p0-x64-mingw32/ruby-2.0.0-p0-x64-mingw32/bin/gem" %1 %2 %3 %4 %5 %6 %7 %8 %9
GOTO :EOF
:WinNT
@"ruby.exe" "%~dpn0" %*
