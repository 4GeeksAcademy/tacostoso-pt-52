import React, { useState, useEffect } from "react";
import { useNavigate  } from "react-router-dom";
// curl -X POST -H "Content-Type: application/json" -d '{"tortilla": 2, "protein": 6, "sauces": [] }

const NewTaco = () => {

    const navigate = useNavigate();

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

    const changeSauces = (evt, item) => {

        if (!item) {
            return
        }

        if (evt.target.checked) {
            setSelectedSauces([...selectedSauces, item.id])
        } else {
            setSelectedSauces(selectedSauces.filter(x => x != item.id))
        }

    }

    const createTaco = async (taco) => {

        const fields = ['sauces', 'protein', 'tortilla'];

        for (let field of fields) {
            if (!(field in taco)) {
                throw new Error(`Missing field ${field} in taco object.`)
            }
        }

        const resp = await fetch(backendUrl + 'api/taco', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taco)
        })

        if (resp.ok) {
            alert("Taco created succesfully.")

            setNewTaco({})
            setSelectedSauces([])

            navigate('/')
        }

        const data = await resp.json()

        return data

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
                <label htmlFor="exampleFormControlInput1" className="form-label">
                    Tortilla
                </label>
                <select className="form-select" defaultValue="Seleccionar Tortilla" onChange={(evt) => setNewTaco({
                    ...newTaco, tortilla: parseInt(evt.target.value)
                })}>
                    <option>Seleccionar Tortilla</option>
                    <option value="1">Harina</option>
                    <option value="2">Maiz</option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">
                    Proteina
                </label>
                <select className="form-select" defaultValue="Seleccionar Proteina" onChange={(evt) => setNewTaco({
                    ...newTaco, protein: parseInt(evt.target.value)
                })}>
                    <option>Seleccionar Proteina</option>
                    {
                        proteins && proteins.map(prot => <option key={`protein-opt-` + prot.id} value={prot.id}>
                            {prot.name}
                        </option>)
                    }
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">
                    Salsas
                </label>
                {sauces && sauces.map(item => <div key={`sauce-` + item.id} className="form-check">
                    <input className="form-check-input" type="checkbox"
                        checked={selectedSauces.includes(item.id)}
                        onChange={evt => changeSauces(evt, item)}
                    />
                    <label className="form-check-label" htmlFor="checkChecked">
                        {item.name}
                    </label>
                </div>)}
            </div>

            <button className="btn btn-primary mb-5"
                onClick={() => createTaco({
                    ...newTaco, sauces: selectedSauces
                })}
            >
                crear
            </button>
        </div>
    </>
}

export default NewTaco;