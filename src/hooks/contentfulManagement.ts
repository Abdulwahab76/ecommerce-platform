// src/lib/contentfulManagement.ts
import { createClient } from 'contentful-management'

const managementClient = createClient({
    accessToken: import.meta.env.VITE_CONTENTFUL_MANAGEMENT_API_KEY,
})

export async function updateProductStock(productId: string, newStock: number, retries = 3) {
    try {
        const space = await managementClient.getSpace(import.meta.env.VITE_CONTENTFULL_SPACEID)
        const environment = await space.getEnvironment(import.meta.env.VITE_CONTENTFUL_ENVIRONMENT_ID || 'master')

        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                // 1. Get the latest version of the entry
                const entry = await environment.getEntry(productId)

                // 2. Unpublish if published (get fresh version after unpublishing)
                if (entry.isPublished()) {
                    await entry.unpublish()
                    // Get fresh version after unpublishing
                    const freshEntry = await environment.getEntry(productId)
                    freshEntry.fields.inStock = { 'en-US': newStock }
                    const updatedEntry = await freshEntry.update()
                    return await updatedEntry.publish()
                }

                // 3. If not published, just update
                entry.fields.inStock = { 'en-US': newStock }
                const updatedEntry = await entry.update()
                return await updatedEntry.publish()

            } catch (error: any) {
                if (attempt === retries - 1) {
                    throw error
                }
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)))
            }
        }
    } catch (error) {
        console.error('Error updating product stock:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to update product stock: ${errorMessage}`)
    }
}