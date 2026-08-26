export default async function logout(navigateTo) {
    const response = await fetch('api/logout');
    const data = await response.json();
    if (data.success) {
        await navigateTo('/');
    }
}