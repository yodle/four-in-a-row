
jQuery(document).ready(function($) {
    var url = "/job-data.php";
    var jobListings = $("#jobListings");
    $.get(url, {}, function(xml) {
        $('job',xml).each(function() {
            var category = $(this).find("category").text();
            if(category === "Technology") {
                var title = $(this).find("title").text();
                var detailUrl = 'http://www.yodlecareers.com/jobs/' + makeURL($(this).find("region").text()) + '/' + makeURL($(this).find("title").text()) + '/';
                jobListings.append("<li><a href=\""+detailUrl+"\">"+title+"</a></li>");
            }
        });
    });

    function makeURL(string) {
        return string.replace(/ /g, "-").replace(/---/g, "-").replace(/,/g, "").toLowerCase();
    }
});
