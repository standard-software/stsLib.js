/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     EmEditor Macro Module
FileName:       stslib_emeditor_macro.js
----------------------------------------
License:        MIT License
All Right Reserved:
    Name:       Standard Software
    URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2018/01/16
//----------------------------------------*/

//----------------------------------------
//◆モジュール呼び出し
//----------------------------------------

//----------------------------------------
//・require関数
//----------------------------------------
//  ・require/moduleの無い環境に対応するために
//    require と requireList をグローバルに追加。
//----------------------------------------
if (typeof module === 'undefined') {

  var requireList = requireList || {};
  var require = function(funcName) {
    if (typeof funcName !== 'string') {
      throw new Error('Error:stslib_emeditor_macro.js require');
    }
    //パス区切り以降のみ動作に採用する
    var index = funcName.lastIndexOf('/');
    if (index !== -1) {
      funcName = funcName.substring(index+1);
    }
    if (funcName === '') {
      throw new Error('Error:stslib_emeditor_macro.js require');
    }

    //拡張子が省略されている場合は追加
    if (funcName.indexOf('.') === -1) {
      funcName += '.js';
    }

    for ( var item in requireList) {
      if (funcName === item) {
        if (requireList.hasOwnProperty(item)) {
          return requireList[item];
        }
      }
    }
    throw new Error('Error:stslib_emeditor_macro.js require');
  };
}

//----------------------------------------
//■全体を囲う無名関数
//----------------------------------------
(function() {

  //----------------------------------------
  //・require実行
  //----------------------------------------
  var stsLib = require('./stslib_core.js')

  //----------------------------------------
  //■stsLib名前空間
  //----------------------------------------
  var stsLib = stsLib || {};
  (function () {
    var _ = stsLib;

    //----------------------------------------
    //◆メッセージ出力(alert/console.log)
    //----------------------------------------
    _.alert = function(message) {
      OutputBar.Visible = true;
      OutputBar.writeln(message);
    };

    //名前空間(オブジェクト)のJavaScriptの命名規則
    //(通常小文字から開始、コンストラクタだけ大文字開始)
    //には沿っていないが
    //エディタ名なので先頭大文字から開始する
    _.EmEditorMacro = stsLib.EmEditorMacro || {};
    (function () {
      var _ = stsLib.EmEditorMacro;

      //----------------------------------------
      //◇一般機能
      //----------------------------------------

      var sel = document.selection;

      //----------------------------------------
      //◇行コメントアウト処理
      //----------------------------------------

      //行がコメントアウトされているかどうかを判断する関数
      _.isLineComment = function (line, commentMark) {
        //alert('isLineComment');
        commentMark = s.excludeEnd(commentMark, ' ');
        if (s.startsWith(
          s.trimStart(line, [' ', '\t']), commentMark)) {
          //alert('isLineComment True');
          return true;
        } else {
          //alert('isLineComment false');
          return false;
        }
      };

      //複数行が全てコメントアウトされているかどうか判断する関数
      _.isLinesComment = function (top, bottom, commentMark) {
        var line;
        for (var i = top; i <= bottom; i += 1) {
          line = document.GetLine(i);
          if (!s.isEmptyLine(line)) {
            if (!_.isLineComment(line, commentMark)) {
              return false;
            }
          }
        }
        return true;
      };

      //1行をコメントアウトする関数
      _.setLineCommentOn = function (line, indentPosition, commentMark) {
        c.assert(indentPosition < line.length);
        return s.start(line, indentPosition) +
          commentMark +
          s.end(line, line.length - indentPosition);
      };

      //複数行をコメントアウトする関数
      _.setLinesCommentOn = function (top, bottom, commentMark) {
        var MAX_INT= 1000;
        var indent = MAX_INT;
        var line;

        //選択範囲のインデント最小値を求める
        for (var i = top; i <= bottom; i += 1) {
          line = document.GetLine(i, eeGetLineWithNewLines);
          if (!s.isEmptyLine(line)) {
            indent = Math.min(indent,
              line.length - s.trimStart(line, [' ', '\t']).length);
          }
        }
        //alert('indent:' + indent);
        if (indent === MAX_INT) {
          indet = 0;
        }
        var result = '';
        for (var i = top; i <= bottom; i += 1) {
          line = document.GetLine(i, eeGetLineWithNewLines);
          if (!s.isEmptyLine(line)) {
            result += _.setLineCommentOn(line, indent, commentMark);
          } else {
            result += line;
          }
        }
        return result;
      }

      //1行をコメント解除する関数
      _.setLineCommentOff = function (line, commentMark) {
        var s = stsLib.string;
        if (_.isLineComment(line, commentMark)) {
          var commentMarkTrimEnd = s.excludeEnd(commentMark, ' ');
          if (commentMark === commentMarkTrimEnd) {
            return s.startFirstDelim(line, commentMark) +
              s.endFirstDelim(line, commentMark);
          } else {
            var index1 = s.indexOfFirst(line, commentMark);
            var index2 = s.indexOfFirst(line, commentMarkTrimEnd);
            if (index1 === -1) {
              return s.startFirstDelim(line, commentMarkTrimEnd) +
                s.endFirstDelim(line, commentMarkTrimEnd);
            } else if (index1 <= index2) {
              return s.startFirstDelim(line, commentMark) +
                s.endFirstDelim(line, commentMark);
            } else {
              return s.startFirstDelim(line, commentMarkTrimEnd) +
                s.endFirstDelim(line, commentMarkTrimEnd);
            }
          }
        } else {
          return line;
        }
      };

      //複数行をコメント解除する関数
      _.setLinesCommentOff = function (top, bottom, commentMark) {
        var d = stsLib.debug;
        var c = stsLib.compare;
        var line;
        var result = '';
        for (var i = top; i <= bottom; i += 1) {
          line = document.GetLine(i, eeGetLineWithNewLines);
          result += _.setLineCommentOff(line, commentMark);
        }

        return result;
      };

      //複数行のコメントを切り替える関数
      _.setLinesCommentOnOff = function (top, bottom, commentMark) {
        //全行がコメントアウトならコメント解除
        if (_.isLinesComment(top, bottom, commentMark)) {
          alert('setLinesCommentOff')
          return _.setLinesCommentOff(top, bottom, commentMark);
        } else {
          alert('setLinesCommentOn')
          return _.setLinesCommentOn(top, bottom, commentMark);
        }
      };

      //----------------------------------------
      //◇範囲コメントアウト処理
      //----------------------------------------
      _.setRangeCommentOnOff = function (top, bottom, commentBegin, commentEnd) {
        c.assert(top <= bottom);

        if (top === bottom) {
          var line = document.GetLine(top, eeGetLineWithNewLines);
          var lienAfterTrim =
            s.trimStart(
              s.trimEnd(line, [' ', '\t', '\r', '\n'])
              , [' ', '\t']);
          if ((s.startsWith(lienAfterTrim, commentBegin))
          && (s.endsWith(lienAfterTrim, commentEnd))) {
            //コメントアウトされている場合
            //コメントアウト記号を取り除く
            return s.trimCutStart(line, [' ', '\t']) +
              s.excludeEnd(
                s.excludeStart(lienAfterTrim, commentBegin),
                commentEnd) +
              s.trimCutEnd(line, [' ', '\t', '\r', '\n']);
          } else {
            //コメントアウトされていない場合
            //コメントアウト記号を追加
            return s.trimCutStart(line, [' ', '\t']) +
              commentBegin +
              lienAfterTrim +
              commentEnd +
              s.trimCutEnd(line, [' ', '\t', '\r', '\n']);
          }
        } else {
          var lineTop = document.GetLine(top, eeGetLineWithNewLines);
          var lineTopAfterTrim = s.trimStart(lineTop, [' ', '\t']);
          var lineBottom = document.GetLine(bottom, eeGetLineWithNewLines);
          var lineBottomAfterTrim = s.trimEnd(lineBottom, [' ', '\t', '\r', '\n']);

          var textCenter = '';
          for (var i = top + 1; i <= bottom - 1; i += 1) {
            textCenter += document.GetLine(i, eeGetLineWithNewLines);
          }
          if ((s.startsWith(lineTopAfterTrim, commentBegin))
          && (s.endsWith(lineBottomAfterTrim, commentEnd))) {
            //コメントアウトされている場合
            //コメントアウト記号を取り除く
            return s.trimCutStart(lineTop, [' ', '\t']) +
              s.excludeStart(lineTopAfterTrim, commentBegin) +
              textCenter +
              s.excludeEnd(lineBottomAfterTrim, commentEnd) +
              s.trimCutEnd(lineBottom, [' ', '\t', '\r', '\n']);
          } else {
            //コメントアウトされていない場合
            //コメントアウト記号を追加
            return s.trimCutStart(lineTop, [' ', '\t']) +
              commentBegin +
              lineTopAfterTrim +
              textCenter +
              lineBottomAfterTrim +
              commentEnd +
              s.trimCutEnd(lineBottom, [' ', '\t', '\r', '\n']);
          }
        }
      };

      //----------------------------------------
      //◇行選択にする
      //----------------------------------------
      //  ・  lastLineBreakOption で
      //      最終行の改行コードまで選択するかしないかを選べる
      //  ・  lastLineBreakOption.OFFだと
      //      少しちらつく
      //      document.GetLine のためだと思われる
      //----------------------------------------
      _.selectLinesTopToBottom = function (top, bottom) {
        c.assert(top <= bottom);

        if (bottom !== document.GetLines()) {
          sel.SetActivePoint(eePosLogical, 1, top, false);
          sel.SetActivePoint(eePosLogical, 1, bottom + 1, true);
        } else {
          sel.SetActivePoint(eePosLogical, 1, top, false);
          sel.SetActivePoint(eePosLogical,
            document.GetLine(bottom).length + 1, bottom, true);
        }
      };

      _.selectLinesBottomToTop = function (top, bottom) {
        c.assert(top <= bottom);

        if (bottom !== document.GetLines()) {
          sel.SetActivePoint(eePosLogical, 1, bottom + 1, false);
          sel.SetActivePoint(eePosLogical, 1, top, true);
        } else {
          sel.SetActivePoint(eePosLogical,
            document.GetLine(bottom).length + 1, bottom, false);
          sel.SetActivePoint(eePosLogical, 1, top, true);
        }
      };

    }());   //stsLib.EmEditorMacro

    //----------------------------------------
    //◆省略呼び出し
    //----------------------------------------
    var x = stsLib.syntax;
    var t = stsLib.type;
    var c = stsLib.compare;
    var a = stsLib.array;
    var n = stsLib.number;
    var s = stsLib.string;
    var d = stsLib.date;
    var p = stsLib.point;
    var v = stsLib.vector;
    var r = stsLib.rect;

  }());   //stsLib

  //----------------------------------------
  //◆モジュール登録
  //----------------------------------------
  var moduleExports = function(object, registFileName) {
    if (typeof module === 'undefined') {
      //拡張子が省略されている場合は追加
      if (registFileName.indexOf('.') === -1) {
        registFileName += '.js';
      }
      requireList[registFileName] = stsLib;
    } else {
      module.exports = object;
    }
  };

  moduleExports(stsLib, 'stslib_emeditor_macro.js');

}()); //(function() {
