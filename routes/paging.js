
paging = (totalPostCount, curPage, pageSize, pageListSize, offset) => {
    if (totalPostCount < 0) totalPostCount = 0;

    const totalPage = Math.ceil(totalPostCount / pageSize); // 전체 페이지 수
    const totalSet = Math.ceil(totalPage / pageListSize) // 전체 세트 수
    const curSet = Math.ceil(curPage / pageListSize); // 현재 세트 번호
    const startPage = ((curSet - 1) * pageListSize) + 1; // 현재 세트 내 출력될 시작 페이지
    let endPage = (startPage + pageListSize) - 1; // 현재 세트 내 출력될 마지막 페이지
    if (totalPage < endPage) endPage = totalPage;

    if (curPage < 0) {
        offset = 0;
    } else {
        offset = (curPage - 1) * 10;
    }

    return { totalPage, totalSet, curSet, startPage, endPage, offset };
};

module.exports = paging;