function initViz() {
    var containerDiv = document.getElementById("vizContainer"),
    url = "https://public.tableau.com/views/AirbnbSanFranciscoAnalysis/Airbnb";
        
    var viz = new tableau.Viz(containerDiv, url); 
}