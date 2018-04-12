@echo off

echo 철권 종료중...
for /f  "tokens=2 delims=," %%i in ('tasklist /fo csv ^| find "Tekken"') do (
	echo %%i
	taskkill /pid %%i /f
)

echo 철권 경로찾는중...
echo 스팀을 거치지 않은 실행이어서 스팀에서 경고창을 띄웁니다.
echo 확인 누르시면 됩니다.
for /f "eol=;" %%i in ('where /r e:\ tekken?7.exe') do (
	SET tekken="%%i 7\TEKKEN 7.EXE"		
)
%tekken%
exit