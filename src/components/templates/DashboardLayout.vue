<template>
	<div class="flex justify-between h-screen bg-white dark:bg-slate-950">
		<aside class="h-full w-[380px]">
			<div class="p-5 flex items-center justify-between">
				 <p class="text-4xl flex-1 text-transparent bg-gradient-to-r inline-block flex items-center justify-center
	 					from-indigo-600 to-purple-600 bg-clip-text font-bold text-center">
	 				Jibber
	 			</p>
	 			<div class="flex gap-3">
	 					<slot name="actions"/>
	 			</div>
			</div>
			<hr class="border-0 border-b border-b-indigo-200 dark:border-b-slate-800 my-2" />
			<slot name="messages"/>
			<hr class="border-0 border-b border-b-indigo-200 dark:border-b-slate-800 my-2" />
			<slot name="channels"/>
		</aside>
		<section class="flex-1 border-x border-x-indigo-200 dark:border-x-slate-800 flex flex-col
						justify-between">
			<slot name="chatbox"/>
		</section>
		<aside class="w-[350px]">
			<slot name="chatinfo"/>
		</aside>
	</div>
</template>

