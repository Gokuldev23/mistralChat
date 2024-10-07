<script>

import "./app.css";
import { onMount } from "svelte";
import { getData } from "./lib/vector";
import { retriveData } from "./lib/retrive";
import { blur } from "svelte/transition";
import Typewriter from 'svelte-typewriter'





onMount(async()=>{
  // await getData()
})

let input = ''
let output = ''
let loading = false

const onSubmit = async () => {
  loading = true
  output = await retriveData(input)
  let u = new SpeechSynthesisUtterance(output)
  let voices = speechSynthesis.getVoices()
  console.log({voices})
  console.log("7",voices[7])
  u.voice = voices[7]
  u.pitch = 1
  u.rate = 0.8
  speechSynthesis.speak(u)
  loading = false
}

</script>


<section class="flex  items-center h-screen bg-slate-700">

  <main class=" max-w-xl w-full mx-auto">
    <div class='relative'>
      <input bind:value="{input}" type="text" class="input input-bordered w-full "/>
      <button class="btn btn-sm absolute px-10  right-2 top-2  btn-primary w-fit" on:click="{onSubmit}">Submit</button>
    </div>
    <div class="min-h-40 px-4  my-4 bg-gray-500 rounded-xl">
      {#if loading}
        <p>Loading....</p>
        {:else}
        <div class="py-4">
          <Typewriter>
            <pre class="card  italic text-justify text-gray-100 block">{output}</pre>
          </Typewriter>
        </div>
      {/if}
    </div>
    
  </main>
</section>

<style>
  pre{
    white-space: break-spaces;
  }
</style>
