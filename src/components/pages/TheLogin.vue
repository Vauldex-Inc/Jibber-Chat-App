<template>
	<div class="bg-blue-50 h-screen flex justify-center items-center gap-28 text-center">
		<section class="w-1/3 flex flex-col justify-center items-center">
			<header class="w-40">
				<p class="text-2xl font-bold text-start">Welcome to</p>
				<h1 class="text-6xl font-bold text-end text-blue-800">Jibber</h1>
			</header>
			<div>
				<img class="w-96 h-96" src="@/assets/images/login-welcome.svg" />
			</div>
		</section>
		<section class="bg-white w-1/3 p-8 rounded-lg">
			<form @submit.prevent class="flex flex-col gap-2">
				<h2 class="font-bold text-3xl mb-4">Login</h2>
				<label for="username" class="text-start text-sm font-bold">Username</label>
				<input type="text" id="username" class="bg-gray-50 p-0.5 rounded-dm border-2 outline-none border-gray-300 focus:border-blue-400 hover:border-blue-400" />
				<label for="password" class="text-start text-sm font-bold">Password</label>
				<input type="password" id="password" class="bg-gray-50 p-0.5 rounded-dm border-2 outline-none border-gray-300 focus:border-blue-400 hover:border-blue-400"/>
				<button type="submit" class="bg-blue-800 text-md p-1 text-white rounded-md mt-4">Submit</button>
			</form>
		</section>
	</div>
</template>
