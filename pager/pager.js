const queryStr = location.search;
let dshopNo = 'all';
const dshopKey = 'ctcd';
if(queryStr.includes(dshopKey)) dshopNo = queryStr.split('?')[1].split(dshopKey + '=')[1].split('&')[0];

let pageNo = 1;
const pageKey = 'pageNo';
if(queryStr.includes(pageKey)) pageNo = queryStr.split('?')[1].split(pageKey + '=')[1].split('&')[0];

const pagingData = 
	{
		"pageObjectId" : "pageDiv", //페이지 표시 할 영역 ID
		"totalItems" : 200,  //총 항목 갯수
		"pageSize" : 10,    //한 페이지 표시항목 갯수
		"pageLineSize" : 5, //페이지 표시 한칸에 뜰 페이지 번호 갯수
		"currentPage" : pageNo,  //현재 페이지 번호
		"currentPageClass" : "select_num", //현재 페이지에 지정할 클래스
		"otherPageClass" : "num",		   //나머지 페이지에 지정할 클래스
		"pageKey" : pageKey,  //uri query에 있는 현재페이지 값의 키
		"dshopKey" : dshopKey,   //uri query에 있는 dshopNo 값의 키
		"dshopValue" : dshopNo, //현재 dshopNo값
		"preBtnClass" : "pre", //preBtn 클래스. 안쓸떄는 false
		"firstBtnClass" : "first", //firstBtn 클래스. 안쓸떄는 false
		"nextBtnClass" : "next", //nextBtn 클래스. 안쓸떄는 false
		"endBtnClass" : "end"  //endBtn 클래스. 안쓸떄는 false
	}

function getPagingHtml(pagingData)
{
	let totalPageCount = parseInt(pagingData.totalItems/pagingData.pageSize); //총 몇페이지인지
	if(pagingData.totalItems%pagingData.pageSize != 0) totalPageCount++;
	
	let currentPageLayer = parseInt(pagingData.currentPage/pagingData.pageLineSize); //현재 페이지가 페이지 칸의 몇번쨰 칸인지
	if(pagingData.currentPage%pagingData.pageLineSize != 0) currentPageLayer++;
	
	let startValue = currentPageLayer * pagingData.pageLineSize - (pagingData.pageLineSize-1); // 현재 페이지목록 시작값
	
	let hrefStr = pagingData.dshopValue != 'all' 
			  ? '?' + pagingData.dshopKey + '=' + pagingData.dshopValue + '&' 
			  : '?'; //href값으로 queryString만 보내면 queryString만 변경 가능	
	hrefStr += pagingData.pageKey;
	
	let rtnStr = "";
	
	if(pagingData.firstBtnClass && startValue >= pagingData.pageLineSize * 2 + 1) rtnStr += "<a href='" + hrefStr + "=1' class='" + pagingData.firstBtnClass + "'>&lt;&lt;</a>";
	if(pagingData.preBtnClass && startValue >= pagingData.pageLineSize + 1) rtnStr += "<a href='" + hrefStr + "=" + (startValue-1) + "' class='" + pagingData.preBtnClass + "'>&lt;</a>";
	
	for(let i = 0; i < pagingData.pageLineSize ; i++)
	{		
		let classStr = //a태그에 들어갈 class 문자열
			(i+startValue) == pagingData.currentPage 
			? pagingData.currentPageClass 
			: pagingData.otherPageClass;
		
		rtnStr += "<a href='" + hrefStr + "=" + (i+startValue) + "' class='" + classStr + "'>" + (i+startValue) + "</a>"
	}
	
	if(pagingData.nextBtnClass && startValue + pagingData.pageLineSize - 1 < totalPageCount) rtnStr += "<a href='" + hrefStr + "=" + (startValue+pagingData.pageLineSize) + "' class='" + pagingData.nextBtnClass + "'>&gt;</a>";
	if(pagingData.endBtnClass && startValue + pagingData.pageLineSize * 2 - 1 < totalPageCount) rtnStr += "<a href='" + hrefStr + "=" + totalPageCount + "' class='" + pagingData.endBtnClass + "'>&gt;&gt;</a>";
	
	logs(totalPageCount,currentPageLayer,startValue,hrefStr,rtnStr); //값 테스트용 로그
	
	return rtnStr;
}

document.getElementById(pagingData.pageObjectId).innerHTML = getPagingHtml(pagingData);

function logs(...arr)  //값 테스트용 로그
{
	arr.forEach((data)=>{console.log(data);});
}