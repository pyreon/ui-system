/**
 * Syncs peerDependency versions for internal @pyreon/* packages.
 *
 * Called from each package's "version" npm lifecycle during `lerna version`.
 * Reads the new version from the package's own package.json (already updated
 * by Lerna) and writes it into any @pyreon/* peerDependencies.
 */

import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const pkgPath = resolve(process.cwd(), "package.json")
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
const version = pkg.version

const internalScope = "@pyreon/"
let changed = false

if (pkg.peerDependencies) {
	for (const name of Object.keys(pkg.peerDependencies)) {
		if (name.startsWith(internalScope)) {
			pkg.peerDependencies[name] = version
			changed = true
		}
	}
}

if (changed) {
	writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
}
