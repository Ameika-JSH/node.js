@echo off

for /f  "tokens=2 delims=," %%i in ('tasklist /fo csv ^| find "zip"') do (
	echo %%i
	taskkill /pid %%i
)
for /f %%i in ('where /r d:\ msh.zip') do (
	start %%i
	exit
)
echo 'done'
::
::for /f  "tokens=2 delims=," %%i in ('tasklist /fo csv ^| find "cmd"') do (
::	echo %%i
::	taskkill /pid %%i
::)
::