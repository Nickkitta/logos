import { saveContent } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { address, coordinates, phone, email, workingHours } = body

    if (!address || !coordinates || !phone || !email || !workingHours) {
      throw createError({
        statusCode: 400,
        message: 'Все поля обязательны'
      })
    }

    // Валидация координат
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      throw createError({
        statusCode: 400,
        message: 'Координаты должны быть массивом из двух чисел [широта, долгота]'
      })
    }

    const contactsData = {
      address,
      coordinates,
      phone,
      email,
      workingHours
    }

    await saveContent('contacts', contactsData)

    return {
      success: true,
      message: 'Контактные данные успешно сохранены'
    }
  } catch (error: any) {
    console.error('Ошибка сохранения контактов:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Ошибка сохранения контактов'
    })
  }
})
