/* =========================================================
   CONEXÃO COM O FIREBASE
   Este arquivo precisa ser carregado DEPOIS dos scripts
   firebase-app-compat, firebase-database-compat e
   firebase-auth-compat, e ANTES dos scripts da página.
   ========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyD_2LiVnc5jB2Cm_kE5pZ11--PcZ_3IVVc",
    authDomain: "conexao-global.firebaseapp.com",
    databaseURL: "https://conexao-global-default-rtdb.firebaseio.com",
    projectId: "conexao-global",
    storageBucket: "conexao-global.firebasestorage.app",
    messagingSenderId: "677064714325",
    appId: "1:677064714325:web:5ee71caaaac9764c718cdc"
};

/*
 * E-mail do administrador (criado em Authentication no console).
 * A SENHA não fica no código: ela só existe no Firebase.
 */
const EMAIL_ADMIN = "admin@conexaoglobal.com";

window.conexaoDB = null;
window.conexaoAuth = null;

try {

    if (window.firebase) {

        firebase.initializeApp(firebaseConfig);

        window.conexaoDB = firebase.database();
        window.conexaoAuth = firebase.auth();

        // O login do administrador NÃO fica salvo no navegador:
        // ao recarregar a página, ele é desconectado.
        window.conexaoAuth
            .setPersistence(firebase.auth.Auth.Persistence.NONE)
            .catch(function (erro) {

                console.error(erro);

            });

    } else {

        console.error("Firebase não foi carregado.");

    }

} catch (erro) {

    console.error("Erro ao iniciar o Firebase:", erro);

}


/* =========================================================
   LOGIN DO ADMINISTRADOR
   Pede a senha e entra no Firebase. Só quem está logado
   consegue apagar mensagens (regra definida no banco).
   ========================================================= */

window.conexaoAdminLogin = async function () {

    if (!window.conexaoAuth) {

        alert("Não foi possível conectar ao servidor.");

        return false;

    }

    // Se ainda houver um login ativo, encerra antes
    // para que a senha seja sempre pedida de novo.
    if (window.conexaoAuth.currentUser) {

        await window.conexaoAuth.signOut();

    }

    const senha = prompt("Digite a senha de administrador:");

    if (senha === null) {

        return false;

    }

    try {

        await window.conexaoAuth.signInWithEmailAndPassword(
            EMAIL_ADMIN,
            senha
        );

        // Desconecta automaticamente depois de 20 segundos,
        // tempo suficiente para a exclusão ser concluída.
        setTimeout(function () {

            window.conexaoAuth.signOut();

        }, 20000);

        return true;

    } catch (erro) {

        alert("❌ Senha incorreta ou administrador não configurado.");

        return false;

    }

};
