<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-4xl font-bold text-center mb-4">Pokémon List</h1>
    <!-- จะแสดงเมื่อ isLoading กำลังโหลดข้อมูล -->
    <div v-if="isLoading" class="text-center">Loading...</div>
    <!-- จะแสดงเมื่อมี error -->
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <!-- จะแสดงเมื่อโหลดข้อมูลเสร็จ -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="pokemon in pokemonData" :key="pokemon.name" class="bg-white p-4 rounded-lg shadow-md">
        <!-- การดึงข้อมูล รูปภาพ มาแสดงแบบ array -->
        <img :src="pokemon.sprites.front_default" :alt="pokemon.name" class="w-full h-auto mb-2 rounded">
        <!-- การดึงข้อมูล ชื่อ มาแสดงแบบ array -->
        <h2 class="text-lg font-semibold text-center">{{ "Name: " + pokemon.name }}</h2>
        <!-- การดึงข้อมูล ประเภท มาแสดงแบบ array 2 มิติ -->
        <h2 class="text-lg font-semibold text-center">{{ "Types: " + pokemon.types.map(type => type.type.name).join(', ') }}</h2>
        <!-- การดึงข้อมูล ความสามารถ มาแสดงแบบ array 2 มิติ -->
        <h2 class="text-lg font-semibold text-center">{{ "Abilities: " + pokemon.abilities.map(ability => ability.ability.name).join(', ') }}</h2>        
      </div>
    </div>
  </div>
</template>

<script setup>
//ref ใช้สำหรับการสร้างรีแอคทีฟรีเฟอเรนซ์ (reactive reference) ซึ่งสามารถใช้ในการจัดการข้อมูลที่มีการเปลี่ยนแปลงและต้องการให้ Vue ทำการเรนเดอร์ใหม่เมื่อค่าของมันเปลี่ยนแปลง
//onMounted เป็นฮุก (hook) ที่ใช้ในการรันฟังก์ชันเมื่อคอมโพเนนต์ถูกเมาท์เข้ากับ DOM เรียบร้อยแล้ว
import { ref, onMounted } from "vue";
import { userStore } from "../src/stores/counter"; //เรียกใช้ store
import axios from "axios"; //เรียกใช้ axios

const store = userStore(); //กำหนดตัวแปร store ให้เท่ากับ function userStore

const isLoading = ref(store.isLoading); //กำหนดตัวแปร isLoading ให้ userStore() ดึงข้อมูลสถานะการโหลดข้อมูล แบบ ref
const error = ref(store.error); //กำหนดตัวแปร error ให้ userStore() ดึงข้อมูล error แบบ ref
const pokemonData = ref([]); //กำหนดตัวแปร pokemonData ให้ userStore() ดึงข้อมูล pokemonData แบบ ref เป็น array = ค่าว่าง

const getData = async () => { // กำหนดให้ฟังก์ชัน getData ทำงานแบบอะซิงโครนัส (async)
  const res = await store.getData(); // รอให้ฟังก์ชัน getData ของ store ดึงข้อมูลเสร็จสิ้น (await) และเก็บผลลัพธ์ในตัวแปร res
  if (res && res.data) { // ตรวจสอบว่า res มีข้อมูล (res) และข้อมูลที่ต้องการ (res.data) หรือไม่
    const detailedDataPromises = res.data.results.map(async (pokemon) => { // สร้างอาเรย์ของ promises โดยดึงข้อมูลรายละเอียดของแต่ละโปเกมอน
      const details = await axios.get(pokemon.url); // รอให้ axios ดึงข้อมูลรายละเอียดของโปเกมอนจาก URL ที่ระบุในตัวแปร pokemon.url
      return details.data; // คืนค่าข้อมูลรายละเอียดของโปเกมอน
    });
    pokemonData.value = await Promise.all(detailedDataPromises); // รอให้ทุก promise ใน detailedDataPromises สำเร็จ (await) และเก็บผลลัพธ์ทั้งหมดใน pokemonData.value
  }
};

onMounted(() => { // เมื่อคอมโพเนนต์ถูกเมาท์เข้ากับ DOM
  getData(); // เรียกใช้ฟังก์ชัน getData เพื่อดึงข้อมูลโปเกมอน
});
</script>

<style scoped>

</style>
