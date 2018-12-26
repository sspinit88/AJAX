module.exports = {
    filename:"smart-grid",
    outputStyle:"scss",
    columns: 16,
    offset: '30px',
    mobileFirst: false,
    container: {
        maxWidth: "1230px",
        fields: "15px"
    },
    breakPoints: {
        md: {
            width: "920px",
            fields: "10px"
        },
        sm: {
            width: "720px"
        	/*fields: "15px"*/
        },
        xs: {
            width: "576px",
        	fields: "0px"
        },
        xxs: {
        	width: "480px",
            fields: "0px"
        },
        xxxs: {
            width: "320px"
        }
    }
};