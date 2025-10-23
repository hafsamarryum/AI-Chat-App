// import { createClient } from '@/lib/supabase-server'

// export async function checkSupabaseConnection() {
//   try {
//     const supabase = await createClient()
//     const { data, error } = await supabase.from('models').select('count').limit(1)
    
//     if (error) {
//       return {
//         ok: false,
//         reachable: true,
//         status: 'error',
//         reason: error.message
//       }
//     }
    
//     return {
//       ok: true,
//       reachable: true,
//       status: 'connected'
//     }
//   } catch (err) {
//     return {
//       ok: false,
//       reachable: false,
//       reason: err instanceof Error ? err.message : 'Unknown error'
//     }
//   }
// }