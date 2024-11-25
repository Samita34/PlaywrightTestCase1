import { test, expect } from '@playwright/test';

// Función para calcular el día dinámico del mes siguiente
function getNextMonthDay() {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const nextMonthDay = nextMonth.getDate();
  return nextMonthDay;
}

// Función para generar un nombre único basado en la fecha y hora actual
function generateUniqueItemName(baseName = 'nuevoitem') {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
  return `${baseName}-${timestamp}`;
}

// Función para navegar al sitio y verificar la página principal
async function navigateToSite(page) {
  await page.goto('http://todo.ly/');
  await expect(page).toHaveTitle('Todo.ly Simple Todo List'); // Verifica el título
  console.log('Página principal cargada correctamente');
}

// Función para iniciar sesión
async function login(page, email, password) {
  await page.locator('.HPHeaderLogin > a').click();
  await page.locator('#ctl00_MainContent_LoginControl1_TextBoxEmail').fill(email);
  await page.locator('#ctl00_MainContent_LoginControl1_TextBoxPassword').fill(password);
  await page.getByRole('button', { name: 'Submit' }).click();

  // Verifica que el campo de nuevo ítem esté visible después de iniciar sesión
  await expect(page.locator('#NewItemContentInput')).toBeVisible();
  console.log('Inicio de sesión exitoso');
}

// Función para crear un nuevo ítem
async function createNewItem(page, itemName, day) {
  await page.locator('#NewItemContentInput').click();
  await page.locator('#NewItemContentInput').fill(itemName);

  const inputValue = await page.locator('#NewItemContentInput').inputValue();
  expect(inputValue).toBe(itemName);
  console.log(`Nuevo ítem preparado con nombre: ${itemName}`);

  await page.locator('#AddItemMore').click();

  // Esperar a que el elemento esté visible y habilitado
  await page.locator('#AddItemAdvDate').waitFor({ state: 'visible' });
  await page.locator('#AddItemAdvDate').scrollIntoViewIfNeeded();
  await page.locator('#AddItemAdvDate').click({ force: true });

  // Navegar al próximo mes en el calendario
  await page.getByTitle('Next').click();
  await page.getByRole('link', { name: day.toString() }).click();

  const selectedDay = await page.locator('.ui-datepicker-current-day a').innerText();
  expect(selectedDay).toBe(day.toString());
  console.log(`Fecha seleccionada correctamente: día ${day}`);

  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByText('Refresh').click();
  console.log('Ítem agregado correctamente');
}

// Test principal
test.use({ browserName: 'webkit' }); // Configurar WebKit como navegador para este test
test('test', async ({ page }) => {
  const email = 'samachuma@gmail.com';
  const password = 'sama1234';

  // Generar un nombre único para el ítem
  const itemName = generateUniqueItemName();

  // Calcular el día dinámico del mes siguiente
  const nextMonthDay = getNextMonthDay();

  // Ejecución de las funciones
  await navigateToSite(page);
  await login(page, email, password);
  await createNewItem(page, itemName, nextMonthDay);
});
