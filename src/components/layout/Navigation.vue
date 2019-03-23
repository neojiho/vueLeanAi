<template>
	<!-- Navigation-->
	<aside class="navigation">
		<nav>
			<ul class="nav luna-nav">
				<li class="nav-category">
					Main section
				</li>
				<li class="active">
					<router-link to="/">Main</router-link>
				</li>
				<li class="">
					<router-link to="/home">Home</router-link>
				</li>
				<li class="">
					<router-link to="/about">About</router-link>
				</li>
				<li class="">
					<router-link to="/login">Login</router-link>
				</li>
				<li class="nav-info">
					<div class="m-t-xs">
						<span class="c-white">Admin</span>
						<span class="c-white">dashBoard</span>
						<br/>
						<!-- HOW TO REMOVE THIS SECTION -->
						<!--<span>
							If you don't want to have this section, just remove it from html and in your css replace:
							.navigation:before { background-color: #24262d; } with
							.navigation:before { background-color: #2a2d35; }
							and
							.navigation { background-color: #24262d; }</code> with <code>.navigation { background-color: #2a2d35; }
						</span>-->
					</div>
				</li>
			</ul>
		</nav>
	</aside>
	<!-- End navigation-->
</template>

<script>
	export default {
		name : "Navigation"
	}
</script>

<style scoped>

</style>