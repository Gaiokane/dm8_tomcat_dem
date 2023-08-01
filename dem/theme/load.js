
function loadDemTheme(appName, themeName) {
    var demCss = document.getElementById("dem-css");
    if (demCss == null) {
        document.write("<link id=\"dem-css\" rel=\"stylesheet\" href=\"theme/dem.css\">");
        document.write("<link rel=\"stylesheet\" href=\"theme/loading.css\">");
    }
}

loadDemTheme(appName, themeName);
