function initViz() {
    var containerDiv = document.getElementById("vizContainer"),
    url = "https://public.tableau.com/views/50YearsofCrime/USCrimeDashboard";
    var options = {
        hideToolbar: true,
    };
    var viz = new tableau.Viz(containerDiv, url, options);
}