@echo off

echo ö�� ������...
for /f  "tokens=2 delims=," %%i in ('tasklist /fo csv ^| find "Tekken"') do (
	echo %%i
	taskkill /pid %%i /f
)

echo ö�� ���ã����...
echo ������ ��ġ�� ���� �����̾ �������� ���â�� ���ϴ�.
echo Ȯ�� �����ø� �˴ϴ�.
for /f "eol=;" %%i in ('where /r e:\ tekken?7.exe') do (
	SET tekken="%%i 7\TEKKEN 7.EXE"		
)
%tekken%
exit