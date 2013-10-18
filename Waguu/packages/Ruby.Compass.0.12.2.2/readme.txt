To compile Compass files during build, add the next line to the project pre-build events:

"$(SolutionDir)packages\Ruby.Compass.0.12.2.2\compile.bat" "$(SolutionDir)packages\Ruby.Compass.0.12.2.2\ruby\bin" "$(ProjectDir)." && echo d | "$(SolutionDir)packages\Ruby.Compass.0.12.2.2\xcopy" /c /d /y "$(ProjectDir)css\*.css" "$(WebProjectOutputDir)\css"

Defaults
--------
CSS dir:          ~/css
Compass config:   ~/config.rb

Change the build event paths if you have a different setup.