import { obtenerEditarCliente, actualizarCliente } from '../data/clientes'
import {
	useNavigate,
	Form,
	useActionData,
	useLoaderData,
	redirect,
} from 'react-router-dom'
import Formulario from '../components/Formulario'
import Error from '../components/Error'

export async function loader({ params }) {
	const cliente = await obtenerEditarCliente(params.clienteId)

	// Creando Mensajes de Error
	if (Object.values(cliente).length === 0) {
		throw new Response('', {
			status: 404,
			statusText: 'No Hay Resultados',
		})
	}
	return cliente
}

export async function action({ request, params }) {
	const formData = await request.formData()
	const datos = Object.fromEntries(formData)
	const email = formData.get('email')

	// Validacion
	const errores = []
	if (Object.values(datos).includes('')) {
		errores.push('Todos los campos son obligatorios')
	}

	// Validar 1 solo campo email
	let regex = new RegExp(
		"([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
	)
	if (!regex.test(email)) {
		errores.push('El email es incorrecto')
	}

	// Retornar datos si hay errores
	if (Object.keys(errores).length) {
		return errores
	}

	// Actualizar el Cliente
	await actualizarCliente(params.clienteId, datos)
	return redirect('/') // Se puede usar navigate pero se recomienda redirect para action y loaders
}

function EditarCliente() {
	const navigate = useNavigate()
	const cliente = useLoaderData()
	const errores = useActionData()
	return (
		<>
			<h1 className=' font-black text-4xl text-blue-900'>Editar Cliente</h1>
			<p className=' mt-3'>
				A continuación podras modificar los datos de un cliente
			</p>

			<div className=' flex justify-end'>
				<button
					className=' bg-blue-800 text-white px-3 py-1 font-bold uppercase'
					onClick={() => navigate('/')}>
					Volver
				</button>
			</div>

			<div className=' bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10 mt-20 '>
				{errores?.length &&
					errores.map((error, i) => <Error key={i}>{error} </Error>)}
				<Form method='post' noValidate>
					<Formulario cliente={cliente} />
					<input
						type='submit'
						className=' mt-5 w-full bg-blue-800 p-3 uppercase font-bold text-white text-lg cursor-pointer'
						value='Registrar Cliente'
					/>
				</Form>
			</div>
		</>
	)
}

export default EditarCliente
