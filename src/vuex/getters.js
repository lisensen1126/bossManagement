/* auth */
export const currentUser = ({auth}) => auth.user
export const currentStore = ({auth}) => auth.user && auth.user.store
export const currentEnterprise = ({auth}) => auth.user && auth.user.enterprise
export const isSystemAdmin = ({auth}) => auth.user && auth.user.role_name === 'SYSTEM_ADMIN'
export const isStoreAdmin = ({auth}) => auth.user && auth.user.role_name === 'STORE_ADMIN'

/* messages */
export const messageStack = ({messages}) => messages.stack

/* notifications */
export const notificationStack = ({notifications}) => notifications.stack
export const playlist = ({notifications}) => notifications.playlist

/* profiles */
export const staff = ({profiles}) => profiles.staff
export const stores = ({profiles}) => profiles.stores
export const insurances = ({profiles}) => profiles.insurances
export const brands = ({profiles}) => profiles.brands
export const salesAssistants = ({profiles}) => profiles.salesAssistants
export const mechanics = ({profiles}) => profiles.mechanics
export const shopCategories = ({profiles}) => profiles.shopCategories

/* payReduction */
export const prData = ({payReduction}) => payReduction.prData
