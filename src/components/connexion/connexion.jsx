import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Connexion = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await axios.post("/api/users/auth/login", {
                username,
                password,
            });

            const { token, user } = res.data;

            // ✅ Stocker dans des cookies
            Cookies.set("token", token, { expires: 7, secure: true });
            Cookies.set("user", JSON.stringify(user), { expires: 7, secure: true });

            navigate("/admin");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Erreur lors de la connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-[90vh] bg-gradient-to-br from-zinc-900 via-neutral-900 to-black px-4">
            <div className="w-full max-w-md bg-neutral-900 border border-yellow-600/20 rounded-xl shadow-lg p-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-yellow-500 text-center mb-6">
                    Se connecter
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="p-3 rounded bg-neutral-800 text-white border border-yellow-500 placeholder-gray-400"
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="p-3 rounded bg-neutral-800 text-white border border-yellow-500 placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-full font-bold bg-yellow-500 text-black hover:bg-yellow-400 transition"
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}
                </form>
            </div>
        </section>
    );
};

export default Connexion;
