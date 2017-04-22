/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     Windows WSH Module
FileName:       stslib_win_wsh.js
----------------------------------------
License:        MIT License
All Right Reserved:
    Name:       Standard Software
    URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2017/04/20
//----------------------------------------*/

WshShell = new ActiveXObject( "WScript.Shell" );

//----------------------------------------
//◆システム
//----------------------------------------

//----------------------------------------
//・ファイル指定したシェル起動
//----------------------------------------
//Const vbHide = 0             'ウィンドウ非表示
//Const vbNormalFocus = 1      '通常表示起動
//Const vbMinimizedFocus = 2   '最小化起動
//Const vbMaximizedFocus = 3   '最大化起動
//Const vbNormalNoFocus = 4    '通常表示起動、フォーカスなし
//Const vbMinimizedNoFocus = 6 '最小化起動、フォーカスなし

function shellFileOpen(FilePath, Focus) {

	WshShell.Run(
		"rundll32.exe url.dll" +
		",FileProtocolHandler " + FilePath
		, Focus, false)
	//ファイル起動の場合
	//第三引数のWaitはtrueにしても無視される様子
}

/*----------------------------------------
◇  ver 2017/03/12
・  作成
◇  ver 2017/04/17
・  ファイル名変更
以降、stslib_core.js でversion管理
//----------------------------------------*/
