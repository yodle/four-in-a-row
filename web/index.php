<!doctype html>
<?php include 'includes/html-start.php'; ?>
	<div class="full-width center clearfix">
		<div class="container_12">
			<div class="main-col12 tablet-col9">
				<div id="imgSliderBorder">
					<div id="imgSlider">
						<figure id="sliderImg1">
							<img src="assets/images/sliderImg1.jpg" alt="Exterior of the Sonoma Golf Club">
							<figcaption>Exterior of the Sonoma Golf Club</figcaption>
						</figure>
						<figure id="sliderImg2">
							<img src="assets/images/sliderImg2.jpg" alt="Exterior of the Fairmont Sonoma Mission Inn &amp; Spa">
							<figcaption>Exterior of the Fairmont Sonoma Mission Inn &amp; Spa</figcaption>
						</figure>
						<figure id="sliderImg3">
							<img src="assets/images/sliderImg3.jpg" alt="Fairmont meeting room">
							<figcaption>Fairmont meeting room</figcaption>
						</figure>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="container" class="full-width center clearfix">
		<div class="container_12">
			<header id="mainHeader" class="main-col12">
				<h1>Join Us for Yodle's Annual Digital Media Summit</h1>
			</header>

			<!-- Main Content -->
			<article id="mainContent" class="main-col9 tablet-col6 border-right">
				<blockquote>Yodle executives invite you to join fellow franchise market leaders in California’s beautiful wine country for our third annual Digital Marketing Summit. Enjoy Sonoma County’s finest vintages and share unique insights into best practices and the latest trends in digital marketing.</blockquote>
				<h2>Make Sure to Arrive Early Thursday!</h2>
				<p>Thursday evening's event begins promptly at 4:45pm so make sure you give yourself enough time to arrive at the hotel and get ready for fun! More details on transportation can be found on our <a href="transportation.php">transportation page</a>.</p>
			</article>
			<!-- End Main Content -->

			<!-- Sidebar -->
			<aside class="main-col3 tablet-col3 border-left">
				<h3>Event Information</h3>
				<strong>2012 Digital Marketing Summit</strong>
				<p>September 13-14, 2012</p>

				<address>
					The Fairmont Sonoma<br>
					Mission Inn &amp; Spa<br>
					100 Boyes Boulevard<br>
					Sonoma, CA,  95476
				</address>
					
				<p>
					<a href="agenda.php">See Agenda</a><br>
					<span>Please RSVP by August 9</span>
				</p>
                
                <p>
                	For more information contact Alisa Adler Lauer at (646) 753-6336 or alauer@yodle.com
                </p>
			</aside>
			<div class="main-col12 tablet-col9 mobile">
				<a class="buttonSecondary button rsvp" href="#">RSVP</a>
			</div>
			<!-- End Sidebar -->
		</div>
	</div>

<!-- Jquery Cycle -->
<script src="assets/js/jquery.cycle.all.js"></script>
<script>
	$('#imgSlider').cycle(
	{
	   fx: 'fade',
	   speed: 1200,
	   timeout: 6000,
	   pager:  '#slide-nav',
	   before: function() {
            $(this).find('figcaption').hide();
        },
		after: function() {
            $(this).find('figcaption').fadeIn()
			}
	});
</script>

<?php include 'includes/footer.php'; ?>
<?php include 'includes/html-end.php'; ?>