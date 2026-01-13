<script setup>
    import { ref } from "vue";
    import duckIcon from "@/assets/duck-drive-icon.png";
    const emit = defineEmits(["login-success"]);

    const username = ref("");
    const password = ref("");
    const isRegistering = ref(false);
    const error = ref("");
    const isSuccess = ref(false);

    async function handleSubmit() {
        error.value = "";
        isSuccess.value = false;
        const endpoint = isRegistering.value? "/api/register" : "/api/login";
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                })
            });
            const data = await response.json();
            if (!response.ok) {
                error.value = data.error;
                isSuccess.value = false;
                return;
            }
            if (isRegistering.value) {
                isSuccess.value = true;
                error.value = 'Registrering lyckades!';
                isRegistering.value = false;
                username.value = "";
                password.value = "";
            } else{
                emit("login-success", data.username);
            }
        } catch (err) {
            error.value = "Connection error";
            isSuccess.value = false;
        }
    }
</script>
<template>
    <div class="login-container">
        <div class="login-box">
            <div class="left-section">
                <img :src="duckIcon" alt="Duck icon" class="icon" />
                    <h1>{{  isRegistering ? 'Skapa ditt konto' : 'Logga in' }}</h1>
            </div>

            <div class="right-section">

                <form @submit.prevent="handleSubmit">
                    <div class="input-group">
                        <input
                        v-model="username"
                        type="text"
                        placeholder="Användarnamn"
                        required
                        class="text-input"
                        />
                    </div>
                    <div class="input-group">
                        <input
                        v-model="password"
                        type="password"
                        placeholder="Lösenord"
                        required
                        class="text-input"
                        />
                    </div>
                    <p v-if="error" class="error" :class="{ success: isSuccess}">{{ error }}</p>
                    <div class="button-container">
                        <button type="submit" class="primary-button">
                            {{ isRegistering ? 'Skapa konto' : 'Logga in' }}
                        </button>
                        
                        <button type="button" @click="isRegistering = !isRegistering" class="secondary-button">
                            {{  isRegistering ? 'Har du redan ett konto? Logga in' : 'Inget konto? Registrera dig här' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f0f2f5;
    }
    .login-box{
        background-color: white;
        padding: 40px;
        padding-top: 60px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 700px;
        text-align: center;
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 40px;
        max-width: 90vw;
    }
    .left-section{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 16px;
        text-align: center;
        padding-top: 0px;
        margin-top: -20px;
        margin-left: -20px;
    }
    .right-section{
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .text-content{
        text-align: left;
    }
    .icon{
        width: 80px;
        height: 80px;
        margin-bottom: 8px;
        margin-left: -35px;
        margin-top: -20px;
    }
    h1 {
        color: #202124;
        font-size: 2em;
        font-weight: 400;
        margin: 0 0 8px 0;
    }
    h2 {
        color: #5f6368;
        font-size: 1.3em;
        font-weight: 400;
        margin: 0;
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    .input-group {
        position: relative;
    }
    .text-input{
        width: 100%;
        padding: 13px 15px;
        border: 1px solid #dadce0;
        border-radius: 4px;
        font-size: 1em;
        color: #202124;
        box-sizing: border-box;
        transition: border-color 0.2s, box-shadow 0.2s;
        font-family: inherit;
    }
    .text-input:hover{
        border-color: #bdc1c6;
    }
    .text-input:focus{
        border-color: #4285f4;
        box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3);
        outline: none;
    }
    .text-input::placeholder{
        color: #80868b;
    }
    .error {
        color: #d93025;
        font-size: 0.9em;
        margin: -8px 0 0 0;
        text-align: left;
    }
    .error.success{
        color: #0f9d58;
    }
    .button-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 24px;
        gap: 12px;
    }
    .primary-button {
        padding: 10px 24px;
        background-color: #1a73e8;
        color: white;
        border: none;
        border-radius: 30px;
        font-size: 1em;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s, box-shadow 0.2s;
        font-family: inherit;
        letter-spacing: 0.5px;
    }
    .primary-button:hover {
        background-color: #174ea6;
        box-shadow: 0 2px 6px rgba(22, 105, 193, 0.4);
    }
    .primary-button:active {
        background-color: #0b3d91;
        box-shadow: 0 3px 6px rgba(11, 61, 145, 0.4);
    }
    .secondary-button {
        padding: 10px 24px;
        background-color: transparent;
        color: #1a73e8;
        border: 1px solid #dadce0;
        border-radius: 30px;
        font-size: 0.9em;
        cursor: pointer;
        transition: background-color 0.2s, border-color 0.2s;
        font-family: inherit;
        letter-spacing: 0.5px;
    }
    .secondary-button:hover{
        background-color: #1f232710;
        border-color: #8ab4f8;
    }
    .secondary-button:active{
        background-color: #3c404311;
        border-color: #669df6;
    }
        @media (max-width: 768px) {
        .login-box {
            grid-template-columns: 1fr;
            width: 90vw;
            gap: 24px;
        }
        
        .left-section {
            border-right: none;
            border-bottom: 1px solid #dadce0;
            padding-right: 0;
            padding-bottom: 24px;
        }
        
        .button-container {
            flex-direction: column;
        }
        
        .primary-button,
        .secondary-button {
            width: 100%;
        }
    }
</style>
            