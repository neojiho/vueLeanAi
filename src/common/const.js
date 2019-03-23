const DATAINFO = {
	RESULT_MESSAGE_KEY : "message",
	RESULT_STATUS_KEY : "status",
	RESULT_DATA_KEY : "body",
};
const APP = {
	DEFAULT_THEME : "black",
	LOCATION : (window.location.origin + "/"),
	BASE_URL_TEST_DATA : `${(window.location.origin + "/")}data/`,
    BASE_URL_TEST : `http://z01:28080/`,
    BASE_URL : `/`,
    BASE_CONTENT_TYPE : 'application/json;charset=UTF-8'

};
APP.BASE_URL = APP.BASE_URL_TEST;
export { DATAINFO, APP }