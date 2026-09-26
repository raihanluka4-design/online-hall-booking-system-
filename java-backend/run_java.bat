@echo off
echo Compiling and Running Java OOP Backend...
javac -d bin src\com\hallbooking\*.java
java -cp bin com.hallbooking.Main
pause
