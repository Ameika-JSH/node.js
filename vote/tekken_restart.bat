@echo off
echo 철권 종료중...
for /f  "tokens=2 delims=," %%i in ('tasklist /fo csv ^| find "Tekken"') do (
	echo %%i
	taskkill /pid %%i /f
)
IF "%TEKKEN%"=="" (
	echo 철권 경로찾는중...
	for %%c in (c d e f g h i j k l m n o p q r s t u v w x y z) do (
		echo %%c드라이브 찾는중...
		for /f %%i in ('where /r %%c:\ tekken?7.exe') do (
			SET RUN_TEKKEN="%%i 7\TEKKEN 7.EXE"
			SETX TEKKEN "%%i 7\TEKKEN 7.EXE"	
			echo 경로저장 완료 - "%%i 7\TEKKEN 7.EXE"
			goto :run
		)
	)
) ELSE (
	echo 경로 확인 - %TEKKEN%
	SET RUN_TEKKEN="%TEKKEN%"
) 
:run
echo 스팀을 거치지 않은 실행이어서 스팀에서 경고창을 띄웁니다.
echo 확인 누르시면 됩니다.
%RUN_TEKKEN%
SET /p tekkenTemp="종료하시려면 엔터키를 눌러주세요..."
