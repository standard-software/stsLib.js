/*----------------------------------------
stsLib.js
Standard Software Library JavaScript
----------------------------------------
ModuleName:     Google Apps Script Spreadsheet Module
FileName:       stslib_gas_spreadsheet.js
----------------------------------------
License:        MIT License
All Right Reserved:
    Name:       Standard Software
    URL:        https://www.facebook.com/stndardsoftware/
--------------------------------------
Version:        2017/03/16
//----------------------------------------*/

function dataLastCol(sheet, rowIndex)
{
	var result = 1
//    Call Assert(-1 <= RowNumber, "Error:DataLastCol")
    if (rowIndex == null)
	{
        result = sheet.getLastColumn();
    }
    else
    {
      for (var i = sheet.getLastColumn(); i>1; i--)
      {
        if (sheet.getRange(rowIndex, i).getValue() != "")
        {
          result = i;
          break;
        }
      }
    }
	return result;
}

function dataLastRow(sheet, colIndex)
{
	var result = 1
//    Call Assert(-1 <= RowNumber, "Error:DataLastCol")
    if (colIndex == null)
	{
        result = sheet.getLastRow();
    }
    else
    {
      for (var i = sheet.getLastRow(); i>1; i--)
      {
        if (sheet.getRange(i, colIndex).getValue() != "")
        {
          result = i;
          break;
        }
      }
    }
	return result;
}

/*----------------------------------------
Åû  ver 2017/03/16
ÅE  çÏê¨
    dataLastCol
    dataLastRow
//----------------------------------------*/
