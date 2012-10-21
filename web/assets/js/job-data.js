
jQuery(document).ready(function($) {
    var url = "/job-data.php";
    var jobListings = $("#jobListings");
    $.get(url, {}, function(xml) {
        $('job',xml).each(function() {
            var category = $(this).find("category").text();
            if(category === "Technology") {
                var title = $(this).find("title").text();
                var detailUrl = $(this).find("detail-url").text();
                jobListings.append("<li><a href="+detailUrl+">"+title+"</a></li>")
            }
        });
    });
});
