<template>
	<main class="bg-blue-50 h-screen flex justify-center items-center gap-20">
		<section class="w-2/5">
			<div class="pb-8">
				<h2 class="font-bold text-4xl">GET STARTED!</h2>
				<p>It's quick and easy</p>
			</div>
			<form @submit.prevent class="bg-white p-8 rounded-lg flex flex-col justify-center gap-3 shadow-md">
				<label for="username" class="pl-2 font-semibold">Username</label>
				<input id="username" type="text" class="bg-gray-50 h-14 px-5 py-3 rounded-md border-2 outline-none border-gray-300 focus:border-indigo-600 hover:border-indigo-600" />
				<label for="password" class="pl-2 font-semibold">Password</label>
				<input id="password" type="password" class="bg-gray-50 h-14 px-5 py-3 p-0.5 rounded-md border-2 outline-none border-gray-300 focus:border-indigo-600 hover:border-indigo-600" />
				<label for="confirm" class="pl-2 font-semibold">Confirm Password</label>
				<input id="confirm" type="password" class="bg-gray-50 h-14 px-5 py-3 p-0.5 rounded-md border-2 outline-none border-gray-300 focus:border-indigo-600 hover:border-indigo-600" />
				<button type="button" class="bg-indigo-600 text-md px-5 py-3 text-white rounded-md mt-4">Register</button>
				<p class="text-center">Already have an account? <RouterLink class="text-indigo-600 focus:border-indigo-600 hover:underline cursor-pointer" to="/login">Login Here</RouterLink></p>
			</form>
		</section>
		<section>
			<h1 class="font-bold text-center text-7xl">JIBBER</h1>
			<img class="mt-10" src="@/assets/images/register-illustration.svg" />
		</section>
	</main>
</template>

<script>
import RouterLink from '@/router/index.ts'

</script>