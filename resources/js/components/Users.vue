<template>
  <div class="container">
    <div class="row mt-4" v-if="$gate.isAdminorAuthor()">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Users</h3>
            <div class="card-tools">
              <button class="btn btn-success" @click="newModal">
                Add New
                <i class="fa fa-user-plus fa-fw"></i>
              </button>
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body table-responsive p-0">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Registered at</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{user.id}}</td>
                  <td>{{user.name}}</td>
                  <td>{{user.email}}</td>
                  <td>
                    <span class="tag tag-success">{{user.type | upText}}</span>
                  </td>
                  <td>{{user.created_at | myDate}}</td>
                  <td>
                    <a href="#" @click="editModal(user)">
                      <i class="fa fa-edit text-blue"></i>
                    </a>/
                    <a href="#" @click="deleteUser(user.id)">
                      <i class="fa fa-trash text-red"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.card-body -->
        </div>
        <!-- /.card -->
      </div>
    </div>

    <div v-if="!$gate.isAdminorAuthor()"><not-found></not-found></div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="addNew"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" v-show="!editmode" id="exampleModalLabel">Add new user</h5>
            <h5 class="modal-title" v-show="editmode" id="exampleModalLabel">Update User info</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form @submit.prevent="editmode ? updateUser() : createUser()">
            <div class="modal-body">
              <div class="form-group">
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  placeholder="Input Name"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('name') }"
                />
                <has-error :form="form" field="name"></has-error>
              </div>

              <div class="form-group">
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  placeholder="Input Email"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('email') }"
                />
                <has-error :form="form" field="email"></has-error>
              </div>

              <div class="form-group">
                <textarea
                  v-model="form.bio"
                  name="bio"
                  placeholder="Input Bio(optional)"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('bio') }"
                ></textarea>
                <has-error :form="form" field="bio"></has-error>
              </div>

              <div class="form-group">
                <select
                  name="type"
                  v-model="form.type"
                  id="type"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('type') }"
                >
                  <option value>Select User role</option>
                  <option value="admin">Admin</option>
                  <option value="standard">Standard User</option>
                  <option value="author">Author</option>
                </select>
                <has-error :form="form" field="type"></has-error>
              </div>

              <div class="form-group">
                <input
                  v-model="form.password"
                  type="password"
                  name="password"
                  placeholder="Input Password"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('password') }"
                />
                <has-error :form="form" field="password"></has-error>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
              <button v-show="!editmode" type="submit" class="btn btn-primary">Create</button>
              <button v-show="editmode" type="submit" class="btn btn-success">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        editmode: false,
        users : {},
        form: new Form({
          id:'',
          name : '',
          email: '',
          password: '',
          type: '',
          bio: '',
          photo: ''
        })
			}
    },
    methods: {
			// getResults(page = 1) {
			//             axios.get('api/user?page=' + page)
			//                 .then(response => {
			//                     this.users = response.data;
			//                 });
			//     },
      updateUser(){
        this.$Progress.start();
        // console.log('Editing data');
        this.form.put('api/user/'+this.form.id)
        .then(() => {
					// success
					Fire.$emit('AfterCreate');
          $('#addNew').modal('hide');
          swal.fire(
          	'Updated!',
            'Information has been updated.',
            'success'
          )
          this.$Progress.finish();
        })
        .catch(() => {
          this.$Progress.fail();
        });
			},
			
      editModal(user){
        this.editmode = true;
        this.form.reset();
        $('#addNew').modal('show');
        this.form.fill(user);
      },
      newModal(){
        this.editmode = false;
        this.form.reset();
        $('#addNew').modal('show');
      },
      deleteUser(id) {
				swal.fire({
						title: "Are you sure?",
						text: "You won't be able to revert this!",
						icon: "warning",
						showCancelButton: true,
						confirmButtonColor: "#3085d6",
						cancelButtonColor: "#d33",
						confirmButtonText: "Yes, delete it!"
				})
					.then(result => {
						if (result.value) {
							this.form
								.delete("api/user/" + id)
								.then(() => {
									swal.fire("Deleted!", "Your file has been deleted.", "success");
									Fire.$emit("AfterCreate");
								})
								.catch(() => {
									swal.fire("Failed!!", "There`s something wrong", "warning");
								});
						}
					});
			},
      loadUsers() {
        if(this.$gate.isAdminorAuthor()){
          axios.get("api/user").then(({ data }) => {
            this.users = data.data;
          });
        }
        
			},
			createUser(){
				this.$Progress.start();
				this.form.post('api/user')
				.then(()=>{
      		Fire.$emit('AfterCreate');
          $('#addNew').modal('hide')
          toast.fire({
            icon: 'success',
            title: 'User Created in successfully'
          })
          this.$Progress.finish();
        })
        .catch(()=>{
        })
      }
    },
    created() {
   		this.loadUsers();
    	Fire.$on("AfterCreate", () => {
      	this.loadUsers();
    	});
   		 // setInterval(() => this.loadUsers(), 3000);
  	}
  }
</script>