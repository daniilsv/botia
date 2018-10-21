'use static';
blocks = {};
const center = {
    init: async () => {
        let raw_blocks = JSON.parse(await httpGet("/api/graph"));

        let nodeDataArray = [];
        let linkDataArray = [];
        for (let block of raw_blocks) {
            console.log(block);
            blocks[block._id] = block;
            nodeDataArray.push({
                key: block._id, text: block.title
            });
            for (let no in block.children) {
                linkDataArray.push({
                    from: block._id,
                    to: block.children[no],
                    color: no
                });
            }
        }
        myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    },
};