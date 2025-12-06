# bon-agents-md

Create an `AGENTS.md` in any directory with a single `bon` command.

## Install

```bash
npm install -g bon-agents-md
```

Requires Node.js 16+.

## Usage

```bash
bon                # create AGENTS.md in the current directory
bon --dir path/to  # create inside the specified directory (creates it if missing)
bon --force        # overwrite an existing AGENTS.md
bon --help         # show help
```

After running `bon`, open `AGENTS.md` and fill in the placeholders so agents have the context they need. The default template includes:

- Project overview and owners
- Goals and definition of done
- Constraints to keep agents safe
- Tools the agent may use
- Style guide and response examples

## Example output

```
# AGENTS for my-project

Use this file to give agents the context they need to operate safely and effectively.
...
```
