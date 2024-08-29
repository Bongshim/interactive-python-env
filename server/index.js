const express = require('express');
const Docker = require('dockerode');
const cors = require('cors');
const app = express();
const docker = new Docker();


// enable cors
app.use(cors());
app.options('*', cors());
app.use(express.json());

app.post('/api/execute', async (req, res) => {
    const {code, packages} = req.body;

    try {
        const container = await createContainer(packages);
        const output = await runCodeInContainer(container, code);
        await container.stop();
        await container.remove();
        res.json({output});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

async function createContainer(packages) {
    const requirementsTxt = packages.join('\n');

    const container = await docker.createContainer({

        Image: 'prebuilt-python:latest',
        Cmd: ['/bin/bash'],
        Tty: true,
        OpenStdin: true,
    });

    await container.start();

    console.log('Requirements:', requirementsTxt);

    // Install packages
    const installExec = await container.exec({
        Cmd: ['bash', '-c', `echo "${requirementsTxt}" > requirements.txt && pip install -r requirements.txt`],
        AttachStdout: true,
        AttachStderr: true
    });

    return new Promise((resolve, reject) => {
        installExec.start(async (err, stream) => {
            if (err) return reject(err);
            let installOutput = '';
            stream.on('data', (chunk) => {
                installOutput += chunk.toString();
                console.log(chunk.toString());
            });
            stream.on('end', () => {
                console.log('Package installation completed');
                console.log(installOutput);
                resolve(container);
            });
        });
    });
}

async function runCodeInContainer(container, code) {
    const exec = await container.exec({
        Cmd: ['python', '-c', code],
        AttachStdout: true,
        AttachStderr: true
    });

    const stream = await exec.start();
    return new Promise((resolve, reject) => {
        let output = '';
        stream.on('data', chunk => output += chunk.toString());
        stream.on('end', () => resolve(output));
        stream.on('error', reject);
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));