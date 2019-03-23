<template>
	<!-- Header-->
	<nav class="navbar navbar-default navbar-fixed-top">
		<div class="container-fluid">
			<div class="navbar-header">
				<div id="mobile-menu">
					<div class="left-nav-toggle">
						<a href="#">
							<i class="stroke-hamburgermenu"></i>
						</a>
					</div>
				</div>
				<a class="navbar-brand" href="index.html">
					LeanAI
					<span>v.1.3</span>
				</a>
			</div>
			<div id="navbar" class="navbar-collapse collapse">
				<div class="left-nav-toggle">
					<a href="">
						<i class="stroke-hamburgermenu"></i>
					</a>
				</div>
				<ul class="nav navbar-nav navbar-right">
					<li class=" profil-link">
						<a href="#">
							<span class="profile-address">joyce@nexr.com</span>
							<img src="images/profile.jpg" class="img-circle" alt="">
						</a>
					</li>
				</ul>
			</div>
			<div class="navbarExpandArea">
			<span class="toggleBtn">
				<i class="fa fa-caret-down"></i>
			</span>
				<div class="navbarExpandContent">
					global navigation bar area
				</div>
			</div>
		</div>
	</nav>
	<!-- End header-->
</template>

<script>

export default {
	name: 'Header'
}
</script>
