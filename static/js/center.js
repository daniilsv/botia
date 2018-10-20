'use static';
const center = {
    init: async () => {
        console.log(await httpGet("/api/graph"));
        // console.log(await httpPost("/api/update", JSON.stringify({"id": 4,
        //     "type": "action",
        //     "title": "get_more_pizdecs",
        //     "type_request": "get",
        //     "url": "itis.team/api/wait_nokia_zaebalo_pzc",
        //     "child_id": 4})));
        // console.log(await httpGet("/api/delete/4"));
        
        console.log(await httpGet("/api/delete/4"));
    },
};