import React, { useState, useEffect } from "react";

// curl -X POST -H "Content-Type: application/json" -d '{"tortilla": 2, "protein": 6, "sauces": [] }

const NewTaco = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [newTaco, setNewTaco] = useState({});
    const [proteins, setProteins] = useState([])
    const [sauces, setSauces] = useState([])

    const [selectedSauces, setSelectedSauces] = useState([])

    const loadProteins = async () => {
        const resp = await fetch(backendUrl + '/api/proteins')
        const data = await resp.json()
        if (resp.ok) {
            setProteins(data);
        }
    }

    const loadSauces = async () => {
        const resp = await fetch(backendUrl + '/api/sauces')
        const data = await resp.json()
        if (resp.ok) {
            setSauces(data);
        }
    }

    useEffect(() => {
        loadProteins()
        loadSauces()
    }, [])


    return <>
        <div className="mx-auto col-6">
            <h1 className="mt-5">
                New Taco
            </h1>
            <div className="mb-3">
                <label for="exampleFormControlInput1" className="form-label">
                    Tortilla
                </label>
                <select className="form-select" onChange={(evt) => setNewTaco({
                    ...newTaco, tortilla: parseInt(evt.target.value)
                })}>
                    <option selected>Seleccionar Tortilla</option>
                    <option value="1">Harina</option>
                    <option value="2">Maiz</option>
                </select>
            </div>
            <div className="mb-3">
                <label for="exampleFormControlTextarea1" className="form-label">
                    Proteina
                </label>
                <select className="form-select" onChange={(evt) => setNewTaco({
                    ...newTaco, proteina: parseInt(evt.target.value)
                })}>
                    <option selected>Seleccionar Proteina</option>
                    {
                        proteins && proteins.map(prot => <option value={prot.id}>
                            {prot.name}
                        </option>)
                    }
                </select>
            </div>

            <div className="mb-3">
                <label for="exampleFormControlTextarea1" className="form-label">
                    Salsas
                </label>
                {sauces && sauces.map(item => <div className="form-check">
                    <input className="form-check-input" type="checkbox" value=""
                        onChange={(evt => setSelectedSauces())}
                    />
                    <label className="form-check-label" for="checkChecked">
                        {item.name}
                    </label>
                </div>)}
            </div>

            <button className="btn btn-primary mb-5" onClick={() => console.log(newTaco)}>
                crear
            </button>
        </div>
    </>
}

export default NewTaco;