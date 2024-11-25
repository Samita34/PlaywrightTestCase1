import { test, expect } from '@playwright/test';

// Función para navegar al sitio y verificar la página principal
async function navigateToSite(page) {
  await page.goto('http://todo.ly/');
  await expect(page).toHaveTitle('Todo.ly Simple Todo List'); // Verifica el título de la página
  console.log('Página principal cargada correctamente');
}

// Función para iniciar sesión
async function login(page, email, password) {
  await page.locator('.HPHeaderLogin > a').click();
  await page.locator('#ctl00_MainContent_LoginControl1_TextBoxEmail').fill(email);
  await page.locator('#ctl00_MainContent_LoginControl1_TextBoxPassword').fill(password);
  const submitButton = page.getByRole('button', { name: 'Submit' });
  await expect(submitButton).toBeVisible(); // Verifica que el botón de inicio de sesión es visible
  await submitButton.click();

  // Verificar que el usuario haya iniciado sesión correctamente
  await expect(page.locator('#mainItemList')).toBeVisible(); // Verifica que la lista de ítems esté visible
  console.log('Inicio de sesión exitoso');
}

// Función para eliminar el primer ítem
async function deleteFirstItem(page) {
  // Hover sobre el primer ítem para asegurarte de que el botón sea visible
  const firstItem = page.locator('#mainItemList .BaseItemLi').first();
  await firstItem.hover();
  console.log('Hover realizado sobre el primer ítem');

  // Verificar que el hover muestra el botón "Options"
  const firstItemOptionsButton = firstItem.locator('.ItemIndicator').locator('div:first-of-type'); // Selector más específico
  await expect(firstItemOptionsButton).toBeVisible(); // Verifica que el botón "Options" es visible
  await firstItemOptionsButton.click();
  console.log('Botón "Options" del primer ítem seleccionado');

  // Hacer clic en "Delete"
  const deleteLink = page.getByRole('link', { name: 'Delete', exact: true });
  await expect(deleteLink).toBeVisible(); // Verifica que el enlace "Delete" es visible
  await deleteLink.click();
  console.log('Ítem eliminado');
}

// Función para actualizar la lista
async function refreshList(page) {
  const refreshButton = page.getByText('Refresh');
  await expect(refreshButton).toBeVisible(); // Verifica que el botón "Refresh" es visible
  await refreshButton.click();
  console.log('Lista actualizada');
}

// Test principal
test('test', async ({ page }) => {
  const email = 'samachuma@gmail.com';
  const password = 'sama1234';

  // Ejecución de las funciones
  await navigateToSite(page);
  await login(page, email, password);
  await deleteFirstItem(page);
  await refreshList(page);
});
