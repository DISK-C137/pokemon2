import { defineStore } from "pinia"; //เรียกใช้ pinia
import axios from "axios"; //เรียกใช้ axios

const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon?limit=50"; //Link API

export const userStore = defineStore({ //function userStore
  id: "pokemonStore", //id
  state: () => ({ //ตัวแปรสำหรับเก็บข้อมูล
    pokemonData: [], //array สำหรับเก็บข้อมูล API pokemon
    isLoading: false, //bool lean สำหรับเก็บสถานะการการโหลดข้อมูล กำหนดให้เป็น false
    error: null, //string เก็บค่า error กำหนดให้เป็น null
  }),
  actions: { //การกระทำ
    //async คือคำสั่งใน JavaScript ที่ใช้ในการกำหนดให้ฟังก์ชันทำงานแบบอะซิงโครนัส (asynchronous) โดยเมื่อฟังก์ชันถูกกำหนดให้เป็น async ฟังก์ชันนั้นจะคืนค่ากลับมาเป็น Promise เสมอ
    async getData() { //ฟังก์ชัน getData
      this.isLoading = true; //กำหนดให้เป็น true
      this.error = null; //กำหนดให้เป็น null
      try {//ทำงาน
        //คำสั่ง await เพื่อรอผลลัพธ์จากการดำเนินการที่ต้องใช้เวลา เช่น การร้องขอข้อมูลจากเซิร์ฟเวอร์โดยไม่ต้องบล็อกการทำงานของโปรแกรมทั้งหมด
        const res = await axios.get(POKEMON_API_URL); //ใช้ axios ดึงข้อมูล API เก็บในตัวแปร res
        if (res.status === 200) { //ถ้า res มีค่าสถานะ (status) = 200
          this.pokemonData = res.data.results; //กำหนดให้ข้อมูลที่ดึงมาได้ (res.data.results) เก็บลงในตัวแปร pokemonData[]
          return res; //คืนค่า res
        } else { //ถ้า res ไม่มีค่าสถานะ (status) = 200
          this.error = `Unexpected status code: ${res.status}`; //แสดง error
          return false; //คืนค่า false
        }
      } catch (error) {//เมื่อไม่สามารถทำงานได้
        if (error.response) { //เมื่อมี error เกิดขึ้น
          this.error = `Error: ${error.response.status} - ${error.response.statusText}`; //แสดง error
          if (error.response.status === 401) { //เมื่อ error มีสถานะเป็น 401
            alert("Unauthorized access. Please check your credentials."); //แสดง error
          }
        } else {//ถ้ามี error นอกเหนือจากนั้น
          this.error = `Network error: ${error.message}`; //แสดง error
        }
        return false; //คืนค่า false
      } finally { //เมื่อโหลดข้อมูลไม่ได้เลย
        this.isLoading = false; //กำหนด isLoading ให้เป็น true
      }
    },
  },
});
