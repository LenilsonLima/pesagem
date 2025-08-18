import { Bounce, toast } from "react-toastify"

export const AlertSucess = (texto) => {
    toast.success(`${texto}`, {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: false,
        theme: "colored",
        closeButton: false,
        transition: Bounce,
    });
}

export const AlertErro = (texto) => {
    toast.error(`${texto}`, {
        position: "top-left",
        autoClose: 5000,
        icon: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        closeButton: false,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    });
}

export const AlertConfirm = (texto, onConfirm) => {
    toast(
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 20, padding: 20 }}>
            <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}>{texto}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', columnGap: 10 }}>
                <button
                    onClick={() => {
                        onConfirm();  // Executa a função de confirmação passada como parâmetro
                        toast.dismiss();  // Fecha o toast
                    }}
                    style={{ cursor: 'pointer', backgroundColor: 'orange', color: 'white', border: 'none', flexGrow: '1', borderRadius: 5, padding: 10 }}>Confirmar</button>
            </div>
        </div>, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        closeButton: false,
        theme: "light",
        transition: Bounce,
    });
}
