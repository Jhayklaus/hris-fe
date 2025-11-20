import { apiService } from '@/services/api'

async function testApiConnection() {
  console.log('Testing API connection...')
  
  try {
    // Test login endpoint
    console.log('Testing login endpoint...')
    const loginResponse = await apiService.login({
      email: 'admin@kola.com',
      password: 'password',
      companyId: 'demo-company'
    })
    console.log('✅ Login successful:', !!loginResponse.token)
    
    // Test profile endpoint
    console.log('Testing profile endpoint...')
    const profile = await apiService.getMyProfile()
    console.log('✅ Profile fetched:', profile.email)
    
    // Test employees endpoint
    console.log('Testing employees endpoint...')
    const employees = await apiService.getEmployees(0, 10)
    console.log('✅ Employees fetched:', employees.total)
    
    console.log('🎉 All API tests passed!')
    return true
  } catch (error) {
    console.error('❌ API test failed:', error)
    return false
  }
}

// Export for use in components
export { testApiConnection }