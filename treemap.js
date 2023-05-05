const DATASETS = {
    videoGames: {
        TITLE: 'Video Game Sales',
        FILE_PATH: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
    },
    movies: {
        TITLE: 'Movie Sales',
        FILE_PATH: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
    },        
    kickStarter: {
        TITLE: 'Kickstarter Pledges',
        FILE_PATH: 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'
    },        
}
// 票房转换函数
function boxConcert(boxOffice) {
    return '$ ' + (boxOffice/1000000).toFixed(3) + ' Million'
}
// console.log(boxConcert(1253400345)); 

// 初始设置
let w = 1600,
    h = 1000

let body = d3.select('body')
body.append('h1')
    .attr('class', 'title')
    .text(DATASETS.movies.TITLE)


let svg = body.append('svg')
                .attr('class', 'treemap')
                .attr('width', w)
                .attr('height', h)
                // .style('background-color', 'pink')

let treemap = d3.treemap().size([w, h]).padding(1).tile(d3.treemapSquarify); 

d3.json(DATASETS.movies.FILE_PATH)
    .then(data => {
        // 颜色绑定
        let color = d3.scaleOrdinal().range(
            [
                '#1f77b4',
                '#aec7e8',
                '#ff7f0e',
                '#ffbb78',
                '#2ca02c',
                '#98df8a',
                '#d62728',
                '#ff9896',
                '#9467bd',
                '#c5b0d5',
                '#8c564b',
                '#c49c94',
                '#e377c2',
                '#f7b6d2',
                '#7f7f7f',
                '#c7c7c7',
                '#bcbd22',
                '#dbdb8d',
                '#17becf',
                '#9edae5'
            ]
        )
        // 绑定数据
        // console.log(data);
        let root = d3.hierarchy(data).sum(d => d.value).sort((a,b) => b.value - a.value)
        treemap(root)

        // 绘制标签
        let tooltip = body.append('div').attr('class', 'tooltip')

        
        // 绘制节点
        let cell = svg.selectAll('g')
                        .data(root.leaves())
                        .enter()
                        .append("g")
                        .attr('class', 'cell')
                        .attr('transform', function (d) {
                            return 'translate(' + d.x0 + ',' + d.y0 + ')';
                        });

        // 绘制矩形
        cell.append('rect')
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr('category', d => d.data.category)
            .attr('name', d => d.data.name)
            .attr('value', d => d.data.value)
            .attr("fill", d => color(d.data.category))
            // .attr('a', d => {console.log(d)})
            .on('mousemove', d => {
                tooltip.style('opacity', 0.8)
                tooltip.html('Name: ' + 
                            d.data.name + 
                            '<br> Value: ' + 
                            boxConcert(d.data.value) + 
                            '<br> Category: ' + 
                            d.data.category)
                        .style('left', window.event.pageX + 20 + 'px')
                        .style('top', window.event.pageY - 28 + 'px');
            })
            .on('mouseout', () => {
                tooltip.style('opacity', 0)
            })
                    
        // 绘制文字
        cell.append('text')
            .attr('class', 'description_text')
            .selectAll('tspan') 
            .data(d => d.data.name.split(/(?=[A-Z][^A-Z]{4})/g))
            .enter()
            .append('tspan')
            .attr('x', 4)
            .attr('y', (d, i) => 16 + i*14)
            .text(d => d)

        // 图例
        let categories = root.leaves().map(d => d.data.category)
        categories = categories.filter((category, index, self) => self.indexOf(category) == index)
        const LEGEND_RECT_SIZE = 20,
                LEGEND_WIDTH = 600,
                LEGEND_SIZE_W = 150,
                LEGEND_SIZE_H = 30

        let legendPerRow = Math.floor(LEGEND_WIDTH/LEGEND_SIZE_W)
         console.log(legendPerRow);

        let legendEle = body.append('svg')
                            .attr('class', 'legend')
                            .attr('width', LEGEND_WIDTH )
                            .selectAll('g')
                            .data(categories)
                            .enter()
                            .append('g')
                            .attr('transform', (d, i) =>
                             'translate(' + 
                            i % legendPerRow * LEGEND_SIZE_W +
                            ',' +
                            Math.floor(i / legendPerRow) * LEGEND_SIZE_H +
                            ')'                                                    
                            )

        legendEle.append('rect')
                    .attr('width', LEGEND_RECT_SIZE)
                    .attr('height', LEGEND_RECT_SIZE)
                    .attr('fill', d => color(d))

        legendEle.append('text')
                .attr('x', LEGEND_RECT_SIZE + 10)
                .attr('y', LEGEND_RECT_SIZE - 5)
                .text(d => d)

    })  