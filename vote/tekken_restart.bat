@echo off
echo ö�� ������...
for /f  "tokens=2 delims=," %%i in ('tasklist /fo csv ^| find "Tekken"') do (
	echo %%i
	taskkill /pid %%i /f
)
IF "%TEKKEN%"=="" (
	echo ö�� ���ã����...
	for %%c in (c d e f g h i j k l m n o p q r s t u v w x y z) do (
		echo %%c����̺� ã����...
		for /f %%i in ('where /r %%c:\ tekken?7.exe') do (
			SET RUN_TEKKEN="%%i 7\TEKKEN 7.EXE"
			SETX TEKKEN "%%i 7\TEKKEN 7.EXE"	
			echo ������� �Ϸ� - "%%i 7\TEKKEN 7.EXE"
			goto :run
		)
	)
) ELSE (
	echo ��� Ȯ�� - %TEKKEN%
	SET RUN_TEKKEN="%TEKKEN%"
) 
:run
echo ������ ��ġ�� ���� �����̾ �������� ���â�� ���ϴ�.
echo Ȯ�� �����ø� �˴ϴ�.
%RUN_TEKKEN%
SET /p tekkenTemp="�����Ͻ÷��� ����Ű�� �����ּ���..."
